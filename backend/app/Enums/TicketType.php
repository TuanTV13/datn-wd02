<?php

namespace App\Enums;

class TicketType
{
    const VIP = 'VIP';
    const Thường = 'Thường';
    const Mời = 'Mời';

    public static function getValues()
    {
        return [
            self::VIP,
            self::Thường,
            self::Mời,
        ];
    }
}
