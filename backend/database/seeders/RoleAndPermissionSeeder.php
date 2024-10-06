<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleAndPermissionSeeder extends Seeder
{
    public function run()
    {
        $permissions = [
            // Quyền của admin
            'manage-users',
            'manage-events',
            'manage-tickets',
            'manage-vouchers',
            'manage-event-promotions',
            'manage-event-categories',
            'manage-reviews',
            'view-statistics',

            // Quyền của user
            'register-account',
            'purchase-ticket',
            'join-event',
            'checkin-event',
            'use-vouchers',
            'view-events',
            'search-events',
            'view-participation-history',
            'view-transaction-history',

            // Quyền của guest
            'register-account',
            'purchase-ticket',
            'join-event',
            'checkin-event',
            'view-events',
            'search-events',
        ];

        // Tạo các quyền trong cơ sở dữ liệu
        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // Tạo và gán quyền cho role admin
        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        $adminRole->givePermissionTo([
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
        ]);

        // Tạo và gán quyền cho role user
        $userRole = Role::firstOrCreate(['name' => 'user']);
        $userRole->givePermissionTo([
            'register-account',
            'purchase-ticket',
            'join-event',
            'checkin-event',
            'use-vouchers',
            'view-events',
            'search-events',
            'view-participation-history',
            'view-transaction-history',
        ]);

        // Tạo và gán quyền cho role guest
        $guestRole = Role::firstOrCreate(['name' => 'guest']);
        $guestRole->givePermissionTo([
            'register-account',
            'purchase-ticket',
            'join-event',
            'checkin-event',
            'view-events',
            'search-events',
        ]);
    }
}
