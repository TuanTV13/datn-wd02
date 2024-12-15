<?php

namespace App\Enums;

class PaymentMethod
{
    const PAYPAL = 'PayPal';
    const CASH = 'Cash';
    const VNPAY = 'VNPay';

    public static function getValues()
    {
        return [
            self::PAYPAL,
            self::CASH,
            self::VNPAY
        ];
    }
}
