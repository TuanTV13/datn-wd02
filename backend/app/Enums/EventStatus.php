<?php

namespace App\Enums;

class EventStatus
{
    const PENDING = 'pending';
    const CONFIRMED = 'confirmed';
<<<<<<< HEAD
    const CHECKIN = 'checkin';
=======
>>>>>>> origin/main
    const ONGOING = 'ongoing';
    const CANCELLED = 'cancaled';
    const COMPLETED = 'completed';

    public static function getValues()
    {
        return [
            self::PENDING,
            self::CONFIRMED,
            self::ONGOING,
            self::CANCELLED,
            self::COMPLETED,
<<<<<<< HEAD
            self::CHECKIN,
=======
>>>>>>> origin/main
        ];
    }
}
