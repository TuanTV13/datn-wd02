<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;

class RoleController extends Controller
{

    // Gán quyền admin cho user
    public function assignAdminRole($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'Người dùng không tồn tại.'], 404);
        }

        if ($user->hasRole('admin')) {
            return response()->json([
                'success' => false,
                'message' => 'Người dùng đã có vai trò admin.',
            ]);
        }

        if ($user) {
            // Gán vai trò admin cho người dùng
            $user->assignRole('admin');
            return response()->json(['message' => 'Vai trò admin đã được gán cho người dùng.']);
        }
    }

    // Thêm quyền cho role
    public function assignPermissionsToRole(Request $request, $roleId)
    {
        $request->validate([
            'permissions' => 'required|array',
            'permissions.*' => 'exists:permissions,name',
        ]);

        // Lấy role
        $role = Role::findById($roleId);

        if (!$role) {
            return response()->json(['message' => 'Role không tồn tại.'], 404);
        }

        // Lọc ra những quyền đã tồn tại trong role (nếu có)
        $existingPermissions = $role->permissions->pluck('name')->toArray();
        $permissionsToAssign = array_diff($request->permissions, $existingPermissions);

        // Nếu tất cả quyền đã tồn tại
        if (empty($permissionsToAssign)) {
            return response()->json([
                'message' => 'Tất cả quyền này đã được gán cho role: ' . $role->name
            ], 400);
        }

        // Gán các quyền mới
        $role->givePermissionTo($permissionsToAssign);

        return response()->json([
            'message' => 'Gán quyền thành công cho role: ' . $role->name,
            'permissions' => $role->permissions->pluck('name')
        ]);
    }

    // Danh sách quyền theo role
    public function getPermissionsByRole($roleId)
    {
        // Tìm role dựa trên ID
        $role = Role::find($roleId);

        if (!$role) {
            return response()->json(['message' => 'Role không tồn tại.'], 404);
        }

        // Lấy danh sách quyền của role
        $permissions = $role->permissions->pluck('name');

        return response()->json([
            'role' => $role->name,
            'permissions' => $permissions
        ]);
    }
}
