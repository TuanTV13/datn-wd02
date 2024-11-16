<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role as SpatieRole;
use Spatie\Permission\Models\Permission as SpatiePermission;
use App\RolesAndPermissions\Role;
use App\RolesAndPermissions\Permission;

class RoleAndPermissionSeeder extends Seeder
{
    public function run()
    {
        foreach (Permission::all() as $permissions) {
            foreach ($permissions as $permission) {
                SpatiePermission::firstOrCreate(['name' => $permission]);
            }
        }

        $adminRole = SpatieRole::firstOrCreate(['name' => Role::ADMIN]);
        $adminRole->givePermissionTo(Permission::ADMIN);

        $userRole = SpatieRole::firstOrCreate(['name' => Role::USER]);
        $userRole->givePermissionTo(Permission::USER);

        $guestRole = SpatieRole::firstOrCreate(['name' => Role::GUEST]);
        $guestRole->givePermissionTo(Permission::GUEST);
    }
}
