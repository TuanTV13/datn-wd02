<?php

namespace App\Enums;

class PaymentMethod
{
    const VNPAY = 'VNPAY';
    const MOMO = 'MOMO';
    const CASH = 'Cash';

    public static function getValues()
    {
        return [
            self::VNPAY,
            self::MOMO,
            self::CASH,
        ];
    }
}
