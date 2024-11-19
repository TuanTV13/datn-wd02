<?php

namespace App\Enums;

class TicketStatus
{
    const PENDING = 'pending';
    const CONFIRMED = 'confirmed';
    const CANCELLED = 'cancelled';
    const AVAILABLE = 'available';
    const SOLD_OUT = 'sold_out';

    public static function getValues()
    {
        return [
            self::PENDING,
            self::CONFIRMED,
            self::CANCELLED,
            self::AVAILABLE,
            self::SOLD_OUT,
        ];
    }
}
