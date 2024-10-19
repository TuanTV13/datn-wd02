<?php

namespace App\Enums;

class VoucherStatus
{
    const DRAFT = 'draft';
    const RELEASE = 'release';
    const COMMING_SOON = 'coming_soon';
    const AVAILABLE = 'available';
    const SOLD_OUT = 'sold_out';
    const SOLD = 'sold';
    const CANCELED = 'canceled';
    const PENDING = 'pending';

    public static function getValues() 
    {
        return [
            self::DRAFT,
            self::RELEASE,
            self::COMMING_SOON,
            self::AVAILABLE,
            self::SOLD_OUT,
            self::SOLD,
            self::CANCELED,
            self::PENDING,
        ];
    }
}