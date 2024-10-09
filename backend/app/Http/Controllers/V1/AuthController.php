<?php

namespace App\Http\Controllers\V1;

use App\Events\UserForgotPassword;
use App\Events\UserRegisterdSuccess;
use App\Helpers\EmailHelper;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Models\User;
use App\Repositories\RefreshRepository;
use App\Repositories\UserRepository;
use Carbon\Carbon;
use Exception;
use GuzzleHttp\Client;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Spatie\Permission\Models\Role;
use Tymon\JWTAuth\Exceptions\JWTException;

class AuthController extends Controller
{
    protected $userRepository;
    protected $api_key;
    protected $client;
    protected $refreshRepository;

    public function __construct(UserRepository $userRepository, RefreshRepository $refreshRepository)
    {
        $this->userRepository = $userRepository;
        $this->client = new Client();
        $this->api_key = env('KICKBOX_API_KEY');
        $this->refreshRepository = $refreshRepository;
    }

    public function verifyEmail($email)
    {
        try {
            $response = $this->client->request('GET', 'https://api.kickbox.com/v2/verify', [
                'query' => [
                    'email' => $email,
                    'apikey' => $this->api_key
                ]
            ]);

            if ($response->getStatusCode() !== 200) {
                Log::error("Kickbox API trả về lỗi: {$response->getStatusCode()}");
                return false;
            }

            $result = json_decode($response->getBody(), true);
            Log::info("Kết quả kiểm tra email: ", $result); 

            if (isset($result['result']) && $result['result'] === 'deliverable') {
                return true;
            }

            Log::warning("Kickbox không xác nhận được email: " . $email);
            return false;
        } catch (Exception $e) {
            Log::error("Lỗi khi gọi API Kickbox: " . $e->getMessage());
            return false;
        }
    }

    public function register(RegisterRequest $request)
    {
        $data = $request->validated();

        $email = EmailHelper::trimEmail($data['email']);

        if (!$this->verifyEmail($email)) {
            Log::info("Email không hợp lệ: " . $email);
            throw ValidationException::withMessages([
                'email' => 'Email không hợp lệ hoặc không tồn tại. Vui lòng thử lại với một địa chỉ email khác.',
            ]);
        }

        try {
            if ($request->hasFile('image')) {
                $data['image'] = Storage::put('users', $request->file('image'));
            }

            $data['password'] = bcrypt($data['password']);

            $data['email_verification_token'] = Str::random(60);

            $user = User::create($data);

            $userRole = Role::findByName('user');
            $user->assignRole($userRole);

            $minutes = config('auth.passwords.users.expire');
            UserRegisterdSuccess::dispatch($user, $minutes);

            return ['message' => 'Vui lòng xác thực tài khoản'];
        } catch (\Throwable $th) {
            Log::error("Lỗi hệ thống khi tạo người dùng: " . $th->getMessage());
            return ['message' => 'Lỗi hệ thống'];
        }
    }

    public function verify(Request $request, $token)
    {
        $user = User::where('email_verification_token', $token)->first();

        if (!$user) {
            return redirect('/your-react-url?status=failed');
        }

        if ($user->email_verified_at) {
            return redirect('/your-react-url?status=already_verified');
        }

        if ($user->email_verified_at) {
            return response()->json([
                'message' => 'Tài khoản của bạn đã được xác thực trước đó.'
            ]);
        }

        $user->email_verified_at = now();
        $user->email_verification_token = null; 
        $user->save();

        return redirect('/your-react-url?status=success');
    }

    private function generateRefreshToken($userId)
    {
        $existingToken = $this->refreshRepository->findByUserId($userId);

        if ($existingToken) {
            $this->refreshRepository->delete($userId);
        }

        $refreshToken = Str::random(60);
        $expiresAt = Carbon::now()->addMinutes(config('jwt.refresh_ttl'));
        $this->refreshRepository->create($userId, $refreshToken, $expiresAt);

        return $refreshToken;
    }

    public function login(LoginRequest $request)
    {
        $credentials = $request->validated();
        $user = $this->userRepository->findByEmail($credentials['email']);

        if (!$user) {
            return response()->json(['message' => 'Không tìm thấy tài khoản']);
        }

        if (!Auth::attempt(['email' => $request->email, 'password' => $request->password])) {
            return response()->json(['message' => 'Mật khẩu sai']);
        }

        if (!$user->hasVerifiedEmail()) {
            return response()->json(['message' => 'Tài khoản chưa được xác thực'], 403);
        }

        if (!$token = JWTAuth::attempt($credentials)) {
            return response()->json(['error' => 'Thông tin xác thực không hợp lệ'], 401);
        }

        $user = Auth::user();
        $token = JWTAuth::fromUser($user);

        return response()->json([
            'access_token' => $token,
            'refresh_token' => $this->generateRefreshToken($user->id),
        ], 200);
    }

    public function refresh(Request $request)
    {
        $refreshToken = $request->input('refresh_token');

        try {
            $storedToken = $this->refreshRepository->findByToken($refreshToken);
            if (!$storedToken) {
                return response()->json(['error' => 'Refresh token không hợp lệ'], 401);
            }

            if (Carbon::now()->greaterThan($storedToken->expires_at)) {
                $storedToken->delete();
                return response()->json(['error' => 'Refresh token đã hết hạn'], 400);
            }

            $user = $this->userRepository->find($storedToken->user_id);
            if (!$user) {
                return response()->json(['error' => 'Tài khoản không tồn tại'], 404);
            }

            $newAccessToken = auth('api')->login($user);
            $newRefreshToken = $this->generateRefreshToken($user->id);

            return response()->json([
                'access_token' => $newAccessToken,
                'refresh_token' => $newRefreshToken,
            ], 200);
        } catch (JWTException $e) {
            return response()->json(['error' => 'Refresh token không hợp lệ'], 400);
        }
    }

    public function logout()
    {
        $user = auth()->user();
        if ($user) {
            $this->refreshRepository->delete($user->id);
        }

        auth()->logout();
        return response()->json(['message' => 'Đăng xuất thành công']);
    }

    public function sendResetOTPEmail(Request $request)
    {
        $email = $request->validate([
            'email' => 'required|email'
        ])['email'];

        $user = User::where('email', $email)->first();

        if (!$user) {
            return response()->json([
                'message' => 'Không tìm thấy tài khoản của bạn.'
            ]);
        }

        $key = $request->ip(); 
        if (RateLimiter::tooManyAttempts('sendCode:' . $key, 5)) {
            $retryAfter = RateLimiter::availableIn('sendCode:' . $key);
            return response()->json([
                'message' => 'Bạn đã gửi quá nhiều yêu cầu, vui lòng thử lại sau ' . $retryAfter . ' giây.'
            ], 429);
        }

        $minutes = config('auth.passwords.users.expire');
        UserForgotPassword::dispatch($user, $minutes);

        RateLimiter::hit('sendCode:' . $key);

        return response()->json([
            'message' => 'Mã xác thực đã được gửi vào email của bạn, vui lòng kiểm tra.'
        ]);
    }



    public function resetPasswordWithOTP(Request $request)
    {
        $data = $request->validate([
            'password' => 'required|min:6|confirmed',
            'verification_code' => 'required|min:6'
        ]);

        $resetEntry = DB::table('password_reset_tokens')
            ->where('token', $data['verification_code'])
            ->first();

        if (!$resetEntry) {
            return response()->json(['message' => 'Mã xác thực không hợp lệ.'], 404);
        }

        $tokenCreatedAt = Carbon::parse($resetEntry->created_at);
        $tokenExpiration = config('auth.passwords.users.expire');
        $expiresAt = $tokenCreatedAt->addMinutes($tokenExpiration);

        if (Carbon::now()->isAfter($expiresAt)) {
            DB::table('password_reset_tokens')->where('token', $data['verification_code'])->delete();
            return response()->json([
                'message' => 'Mã xác thực hết hạn'
            ], 400);
        }

        $user = User::where('email', $resetEntry->email)->first();
        if (!$user) {
            return response()->json(['message' => 'Người dùng không tồn tại.'], 404);
        }

        $user->password = Hash::make($data['password']);
        $user->save();

        DB::table('password_reset_tokens')->where('email', $resetEntry->email)->delete();

        return response()->json(['message' => 'Mật khẩu đã được cập nhật thành công'], 200);
    }
}
