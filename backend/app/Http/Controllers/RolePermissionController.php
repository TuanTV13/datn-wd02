<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;

class RolePermissionController extends Controller
{

    public function assignAdminRole($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'Người dùng không tồn tại.'], 404);
        }

        if ($user->hasRole('admin')) {
            return response()->json([
                'message' => 'Người dùng đã có vai trò admin.',
            ]);
        }

        if ($user) {
            $user->assignRole('admin');
            return response()->json(['message' => 'Vai trò admin đã được gán cho người dùng.']);
        }
    }

    public function assignPermissionsToRole(Request $request, $roleId)
    {
        $request->validate([
            'permissions' => 'required|array',
            'permissions.*' => 'exists:permissions,name',
        ]);

        $role = Role::findById($roleId);

        if (!$role) {
            return response()->json(['message' => 'Role không tồn tại.'], 404);
        }

        $existingPermissions = $role->permissions->pluck('name')->toArray();
        $permissionsToAssign = array_diff($request->permissions, $existingPermissions);

        if (empty($permissionsToAssign)) {
            return response()->json([
                'message' => 'Tất cả quyền này đã được gán cho role: ' . $role->name
            ], 400);
        }

        $role->givePermissionTo($permissionsToAssign);

        return response()->json([
            'message' => 'Gán quyền thành công cho role: ' . $role->name,
            'permissions' => $role->permissions->pluck('name')
        ]);
    }

    public function getPermissionsByRole($roleId)
    {
        $role = Role::find($roleId);

        if (!$role) {
            return response()->json(['message' => 'Role không tồn tại.'], 404);
        }

        $permissions = $role->permissions->pluck('name');

        return response()->json([
            'role' => $role->name,
            'permissions' => $permissions
        ]);
    }
}
