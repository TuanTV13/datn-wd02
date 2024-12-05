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
        // Tìm người dùng theo ID
        $user = User::find($id);

        // Kiểm tra nếu người dùng không tồn tại
        if (!$user) {
            return response()->json(['message' => 'Người dùng không tồn tại.'], 404);
        }

        // Kiểm tra nếu người dùng đã có vai trò admin
        if ($user->hasRole('admin')) {
            return response()->json([
                'message' => 'Người dùng đã có vai trò admin.',
            ]);
        }

        // Gán vai trò admin cho người dùng
        $user->assignRole('admin');
        return response()->json(['message' => 'Vai trò admin đã được gán cho người dùng.']);
    }


    public function assignPermissionsToRole(Request $request, $roleId)
    {
        // Xác thực dữ liệu từ request
        $request->validate([
            'permissions' => 'required|array', // Phải là mảng
            'permissions.*' => 'exists:permissions,name', // Mỗi quyền phải tồn tại trong bảng permissions
        ]);

        // Tìm role theo ID
        $role = Role::findById($roleId);

        // Kiểm tra nếu role không tồn tại
        if (!$role) {
            return response()->json(['message' => 'Role không tồn tại.'], 404);
        }

        // Lấy danh sách quyền hiện tại của role
        $existingPermissions = $role->permissions->pluck('name')->toArray();

        // Lọc ra các quyền mới chưa được gán
        $permissionsToAssign = array_diff($request->permissions, $existingPermissions);

        // Nếu tất cả quyền đã được gán, trả về thông báo
        if (empty($permissionsToAssign)) {
            return response()->json([
                'message' => 'Tất cả quyền này đã được gán cho role: ' . $role->name
            ], 400);
        }

        // Gán quyền mới cho role
        $role->givePermissionTo($permissionsToAssign);

        // Trả về phản hồi thành công
        return response()->json([
            'message' => 'Gán quyền thành công cho role: ' . $role->name,
            'permissions' => $role->permissions->pluck('name') // Trả về danh sách quyền mới của role
        ]);
    }


    public function getPermissionsByRole($roleId)
    {
        // Tìm role theo ID
        $role = Role::find($roleId);

        // Kiểm tra nếu role không tồn tại
        if (!$role) {
            return response()->json(['message' => 'Role không tồn tại.'], 404);
        }

        // Lấy danh sách quyền của role
        $permissions = $role->permissions->pluck('name');

        // Trả về dữ liệu
        return response()->json([
            'role' => $role->name, // Tên role
            'permissions' => $permissions // Danh sách quyền
        ]);
    }
}
