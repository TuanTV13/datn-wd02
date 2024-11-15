<?php

namespace App\Enums;

class PaymentMethod
{
    const PAYPAL = 'PayPal';
    const CASH = 'Cash';

    public static function getValues()
    {
        return [
            self::PAYPAL,
            self::CASH,
        ];
    }
}
