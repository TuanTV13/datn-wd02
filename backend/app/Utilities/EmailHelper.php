<?php

namespace App\Helpers;

class EmailHelper
{
    public static function trimEmail($email)
    {
        return trim($email);
    }

    public static function toLowerCase($email)
    {
        return strtolower($email);
    }
}
