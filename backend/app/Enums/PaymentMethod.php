<?php

namespace App\Enums;

class PaymentMethod
{
    const CREDIT_CARD = 'credit_card';
    const PAYPAL = 'paypal';
    const BANK_TRANSFER = 'bank_transfer';
    const CASH = 'cash';

    public static function getValues()
    {
        return [
            self::CREDIT_CARD,
            self::PAYPAL,
            self::BANK_TRANSFER,
            self::CASH,
        ];
    }
}
