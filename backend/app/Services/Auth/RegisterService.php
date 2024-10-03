<?php

namespace App\Services\Auth;

use App\Events\UserRegisterdSuccess;
use App\Http\Requests\Auth\RegisterRequest;
use App\Models\User;
use App\Repositories\Auth\RegisterRepository;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class RegisterService
{
    protected $registerRepository;

    public function __construct(RegisterRepository $registerRepository)
    {
        $this->registerRepository = $registerRepository;
    }

    public function create(RegisterRequest $registerRequest)
    {
        try {
            DB::transaction(function () use ($registerRequest) {

                $data = $registerRequest->validated();

                if ($registerRequest->hasFile('image')) {
                    $data['image'] = Storage::put('users', $registerRequest->file('image'));
                }

                $data['password'] = bcrypt($data['password']);

                $data['email_verification_token'] = Str::random(60);

                $user = User::create($data);

                $minutes = config('auth.passwords.users.expire');

                UserRegisterdSuccess::dispatch($user, $minutes);
            }, 3);

            return ['message' => 'Tài khoản cần được xác thực'];
        } catch (ValidationException $e) {
            Log::error($e->getMessage(), $e->errors());

            return ['message' => 'Lỗi trong quá trình tạo tài khoản'];
        }
    }
}
