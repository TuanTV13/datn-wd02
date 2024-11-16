<?php

namespace App\Http\Middleware;

use Closure;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;
use Tymon\JWTAuth\Exceptions\TokenInvalidException;
use Tymon\JWTAuth\Facades\JWTAuth;

class CheckJwt
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $token = $request->bearerToken();

        if (!$token) {
            return response()->json([
                'message' => 'Không tìm thấy token'
            ], 400);
        }

        try {

            $user = JWTAuth::parseToken()->authenticate();

            return $next($request);
        } catch (TokenExpiredException $exp) {
            Log::error("message" . $exp->getMessage());

            return response()->json([
                'message' => 'Token hết hạn'
            ], 401);
        } catch (TokenInvalidException $inv) {
            Log::error("TokenInvalidException: " . $inv->getMessage());

            // Trả về lỗi token không hợp lệ
            return response()->json([
                'message' => 'Token không hợp lệ'
            ], 401);
        } catch (Exception $e) {
            Log::error("message" . $e->getMessage());

            return response()->json([
                'message' => 'Có lỗi xảy ra khi xử lý token'
            ], 500);
        }
    }
}
