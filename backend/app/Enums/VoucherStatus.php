<?php

namespace App\Enums;

class VoucherStatus
{
    const DRAFT = 'draft';
    const PENDING = 'pending';
    const PUBLISHED = 'published';
    
    const VALID = 'valid';
    const EXPIRED = 'expired';
    const USED = 'used';
    const CANCELLED = 'cancelled';
    const OUT_OF_STOCK = 'out_of_stock';

    public static function getValues() 
    {
        return [
            self::DRAFT,
            self::PENDING,
            self::PUBLISHED,
            self::VALID,
            self::EXPIRED,
            self::USED,
            self::CANCELLED,
            self::OUT_OF_STOCK,
        ];
    }
}