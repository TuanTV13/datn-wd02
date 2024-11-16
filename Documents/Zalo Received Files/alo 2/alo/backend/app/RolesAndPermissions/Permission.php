<?php

namespace App\RolesAndPermissions;

class Permission
{
    const GUEST = [
        'register-account',
        'purchase-ticket',
        'join-event',
        'checkin-event',
        'view-events',
        'search-events',
    ];

    const USER = [
        'register-account',
        'purchase-ticket',
        'join-event',
        'checkin-event',
        'use-vouchers',
        'view-events',
        'search-events',
        'view-participation-history',
        'view-transaction-history',
    ];

    const ADMIN = [
        'manage-users',
        'manage-events',
        'manage-tickets',
        'manage-vouchers',
        'manage-event-promotions',
        'manage-event-categories',
        'manage-reviews',
        'view-statistics',
        'purchase-ticket',
        'join-event',
        'checkin-event',
        'use-vouchers',
        'view-events',
        'search-events',
    ];

    public static function all()
    {
        return [
            'guest' => self::GUEST,
            'user' => self::USER,
            'admin' => self::ADMIN,
        ];
    }
}
