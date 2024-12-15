<?php

namespace App\Http\Services;

use Exception;
use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\Log;
use PayPal\Rest\ApiContext;
use PayPal\Auth\OAuthTokenCredential;
use PayPal\Api\Item;
use PayPal\Api\ItemList;
use PayPal\Api\Amount;
use PayPal\Api\Transaction;
use PayPal\Api\RedirectUrls;
use PayPal\Api\Payment;
use PayPal\Api\Payer;
use PayPal\Api\PaymentExecution;

class PayPalService
{
    // Chứa context của API
    private $apiContext;
    // Chứa danh sách các item (mặt hàng)
    private $itemList = [];
    // Đơn vị tiền thanh toán
    private $paymentCurrency;
    // Tổng tiền của đơn hàng
    private $totalAmount;
    // Đường dẫn để xử lý một thanh toán thành công
    private $returnUrl;
    // Đường dẫn để xử lý khi người dùng bấm cancel (không thanh toán)
    private $cancelUrl;

    public function __construct()
    {
        // Đọc các cài đặt trong file config
        $paypalConfigs = config('paypal');

        if (empty($paypalConfigs['client_id']) || empty($paypalConfigs['secret'])) {
            throw new \Exception('PayPal Client ID and Secret must be configured in the .env file.');
        }
        // Khởi tạo ngữ cảnh
        $this->apiContext = new ApiContext(
            new OAuthTokenCredential(
                $paypalConfigs['client_id'],
                $paypalConfigs['secret']
            )
        );

        // Set mặc định đơn vị tiền để thanh toán
        $this->paymentCurrency = "USD";

        // Khởi tạo total amount
        $this->totalAmount = 0;
    }

    /**
     * Set payment currency
     *
     * @param string $currency String name of currency
     * @return self
     */
    public function setCurrency($currency)
    {
        $this->paymentCurrency = $currency;

        return $this;
    }

    /**
     * Get current payment currency
     *
     * @return string Current payment currency
     */
    public function getCurrency()
    {
        return $this->paymentCurrency;
    }

    /**
     * Add item to list
     *
     * @param array $itemData Array item data
     * @return self
     * @throws \InvalidArgumentException
     */
    public function setItem($itemData)
    {
        // Kiểm tra xem item được thêm vào là một hay một
        // mảng các item. Nếu chỉ là 1 item, thì chúng ta sẽ
        // cho nó thành một mảng item rồi foreach. Việc này giúp
        // chúng ta có thể thêm một hay nhiều item cùng lúc
        if (count($itemData) === count($itemData, COUNT_RECURSIVE)) {
            $itemData = [$itemData];
        }

        // Duyệt danh sách các item
        foreach ($itemData as $data) {
            // Kiểm tra tính hợp lệ của item
            if (empty($data['name']) || empty($data['sku']) || empty($data['quantity']) || empty($data['price'])) {
                throw new \InvalidArgumentException('Item data is incomplete.');
            }

            // Khởi tạo item
            $item = new Item();
            $item->setName($data['name'])
                ->setCurrency($this->paymentCurrency) // Đơn vị tiền của item
                ->setSku($data['sku']) // ID của item
                ->setQuantity($data['quantity']) // Số lượng
                ->setPrice($data['price']); // Giá

            // Thêm item vào danh sách
            $this->itemList[] = $item;

            // Tính tổng đơn hàng với số học chính xác
            $this->totalAmount = bcadd($this->totalAmount, bcmul($data['price'], $data['quantity'], 2), 2);
        }

        return $this;
    }

    /**
     * Get list item
     *
     * @return array List item
     */
    public function getItemList()
    {
        return $this->itemList;
    }

    /**
     * Get total amount
     *
     * @return mixed Total amount
     */
    public function getTotalAmount()
    {
        return $this->totalAmount;
    }

    /**
     * Set return URL
     *
     * @param string $url Return URL for payment process complete
     * @return self
     */
    public function setReturnUrl($url)
    {
        $this->returnUrl = $url;

        return $this;
    }

    /**
     * Get return URL
     *
     * @return string Return URL
     */
    public function getReturnUrl()
    {
        return $this->returnUrl;
    }

    /**
     * Set cancel URL
     *
     * @param string $url Cancel URL for payment
     * @return self
     */
    public function setCancelUrl($url)
    {
        $this->cancelUrl = $url;

        return $this;
    }

    /**
     * Get cancel URL of payment
     *
     * @return string Cancel URL
     */
    public function getCancelUrl()
    {
        return $this->cancelUrl;
    }

    /**
     * Create payment
     *
     * @param string $transactionDescription Description for transaction
     * @return mixed Paypal checkout URL or false
     */
    public function createPayment($transactionDescription)
    {
        $checkoutUrl = false;

        // Chọn kiểu thanh toán.
        $payer = new Payer();
        $payer->setPaymentMethod('paypal');

        // Danh sách các item
        $itemList = new ItemList();
        $itemList->setItems($this->itemList);

        // Tổng tiền và kiểu tiền sẽ sử dụng để thanh toán.
        $amount = new Amount();
        $amount->setCurrency($this->paymentCurrency)
            ->setTotal($this->totalAmount);

        // Transaction
        $transaction = new Transaction();
        $transaction->setAmount($amount)
            ->setItemList($itemList)
            ->setDescription($transactionDescription);

        // Đường dẫn để xử lý một thanh toán thành công.
        $redirectUrls = new RedirectUrls();

        // Kiểm tra xem có tồn tại đường dẫn khi người dùng hủy thanh toán
        // hay không. Nếu không, mặc định chúng ta sẽ dùng luôn $redirectUrl
        if (is_null($this->cancelUrl)) {
            $this->cancelUrl = $this->returnUrl;
        }

        $redirectUrls->setReturnUrl($this->returnUrl)
            ->setCancelUrl($this->cancelUrl);

        // Khởi tạo một payment
        $payment = new Payment();
        $payment->setIntent('Sale')
            ->setPayer($payer)
            ->setRedirectUrls($redirectUrls)
            ->setTransactions([$transaction]);

        // Thực hiện việc tạo payment
        try {
            $payment->create($this->apiContext);
        } catch (Exception $paypalException) {
            Log::error('PayPal Payment Error: ' . $paypalException->getMessage());
            throw new \Exception($paypalException->getMessage());
        }

        // Nếu việc thanh tạo một payment thành công. Chúng ta sẽ nhận
        // được một danh sách các đường dẫn liên quan đến việc
        // thanh toán trên PayPal
        foreach ($payment->getLinks() as $link) {
            // Duyệt từng link và lấy link nào có rel
            // là approval_url rồi gán nó vào $checkoutUrl
            // để chuyển hướng người dùng đến đó.
            if ($link->getRel() == 'approval_url') {
                $checkoutUrl = $link->getHref();
                // Lưu payment ID vào session để kiểm tra
                // thanh toán ở function khác
                session(['paypal_payment_id' => $payment->getId()]);

                break;
            }
        }

        // Trả về url thanh toán để thực hiện chuyển hướng
        return $checkoutUrl;
    }

    /**
     * Get payment status
     *
     * @return mixed Object payment details or false
     */
    public function getPaymentStatus()
    {
        // Khởi tạo request để lấy một số query trên
        // URL trả về từ PayPal
        $request = Request::all();

        // Lấy Payment ID từ session
        $paymentId = session('paypal_payment_id');
        // Xóa payment ID đã lưu trong session
        session()->forget('paypal_payment_id');

        // Kiểm tra xem URL trả về từ PayPal có chứa
        // các query cần thiết của một thanh toán thành công
        // hay không.
        if (empty($request['PayerID']) || empty($request['token'])) {
            return false;
        }

        // Khởi tạo payment từ Payment ID đã có
        $payment = Payment::get($paymentId, $this->apiContext);

        // Thực thi payment và lấy payment detail
        $paymentExecution = new PaymentExecution();
        $paymentExecution->setPayerId($request['PayerID']);

        $paymentStatus = $payment->execute($paymentExecution, $this->apiContext);

        return $paymentStatus;
    }
}
