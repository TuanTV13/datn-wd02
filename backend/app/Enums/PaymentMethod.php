<?php

namespace App\Enums;

class PaymentMethod
{
    const ZALOPAY = 'ZALOPAY';
    const CASH = 'Cash';

    public static function getValues()
    {
        return [
            self::ZALOPAY,
            self::CASH,
        ];
    }
}
