<?php

namespace App\Enums;

class TransactionStatus
{
    const PENDING = 'pending';
    const COMPLETED = 'completed';
    const FAILED = 'failed';

    public static function getValues()
    {
        return [
            self::PENDING,
            self::COMPLETED,
            self::FAILED,
        ];
    }
}
