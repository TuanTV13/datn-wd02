<?php

namespace App\Http\Services;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class MoMoService
{
    protected $endpoint;
    protected $partnerCode;
    protected $accessKey;
    protected $secretKey;
    protected $returnUrl;
    protected $notifyUrl;

    public function __construct()
    {
        $this->endpoint = config('momo.endpoint');
        $this->partnerCode = config('momo.partner_code');
        $this->accessKey = config('momo.access_key');
        $this->secretKey = config('momo.secret_key');
        $this->returnUrl = config('momo.return_url');
        $this->notifyUrl = config('momo.notify_url');
    }

    public function createPayment(Request $request)
    {
        $orderId = time(); // Mã đơn hàng
        $orderInfo = "Thanh toán hóa đơn #" . $orderId;
        $amount = $request->input('amount'); // Số tiền
        $requestId = time(); // Mã yêu cầu thanh toán
        $extraData = ""; // Dữ liệu bổ sung (nếu có)

        // Dữ liệu gửi đến MoMo
        $data = [
            'partnerCode' => $this->partnerCode,
            'accessKey' => $this->accessKey,
            'requestId' => $requestId,
            'amount' => $amount,
            'orderId' => $orderId,
            'orderInfo' => $orderInfo,
            'returnUrl' => $this->returnUrl,
            'notifyUrl' => $this->notifyUrl,
            'extraData' => $extraData,
            'requestType' => 'captureWallet',
        ];

        // Tạo chữ ký (signature)
        $data['signature'] = $this->generateSignature($data);

        // Gửi yêu cầu đến MoMo
        $result = $this->sendRequest($data);

        if (isset($result['payUrl'])) {
            return response()->json([
                'status' => 'success',
                'payment_url' => $result['payUrl']
            ]);
        }

        return response()->json([
            'status' => 'error',
            'message' => $result['message'] ?? 'Không thể tạo thanh toán'
        ]);
    }

    protected function generateSignature(array $data)
    {
        ksort($data);
        $rawHash = urldecode(http_build_query($data));
        return hash_hmac('sha256', $rawHash, $this->secretKey);
    }

    protected function sendRequest(array $data)
    {
        $client = new \GuzzleHttp\Client();
        try {
            $response = $client->post($this->endpoint, [
                'json' => $data
            ]);
            return json_decode($response->getBody(), true);
        } catch (\Exception $e) {
            Log::error('MoMo API Error: ' . $e->getMessage());
            return [
                'message' => 'Lỗi kết nối đến MoMo API',
            ];
        }
    }

    public function handleReturn(Request $request)
    {
        // Lấy dữ liệu từ MoMo trả về
        $data = $request->all();

        // Xác thực chữ ký
        $signature = $data['signature'] ?? '';
        unset($data['signature']);
        if ($signature !== $this->generateSignature($data)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Chữ ký không hợp lệ'
            ]);
        }

        if ($data['errorCode'] == '0') {
            return response()->json([
                'status' => 'success',
                'message' => 'Thanh toán thành công',
                'data' => $data
            ]);
        }

        return response()->json([
            'status' => 'error',
            'message' => 'Thanh toán không thành công. Mã lỗi: ' . $data['errorCode']
        ]);
    }
}
