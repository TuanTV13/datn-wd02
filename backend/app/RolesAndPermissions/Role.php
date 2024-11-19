<?php

namespace App\RolesAndPermissions;

class Role
{
    const ADMIN = 'admin';
    const USER = 'user';
    const GUEST = 'guest';

    public static function getValue()
    {
        return [
            self::ADMIN,
            self::USER,
            self::GUEST,
        ];
    }
}
