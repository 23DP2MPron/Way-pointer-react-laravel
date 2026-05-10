<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        if ($request->user()->role !== 'admin') abort(403);
        return response()->json(User::latest()->paginate(20));
    }

    public function show(User $user): JsonResponse
    {
        return response()->json($user);
    }

    public function update(Request $request, User $user): JsonResponse
    {
        if ($request->user()->role !== 'admin') abort(403);

        $data = $request->validate([
            'name'  => ['sometimes', 'string'],
            'email' => ['sometimes', 'email', 'unique:users,email,' . $user->id],
            'role'  => ['sometimes', 'in:user,admin'],
        ]);

        $user->update($data);
        return response()->json($user);
    }

    public function destroy(Request $request, User $user): JsonResponse
    {
        if ($request->user()->role !== 'admin') abort(403);
        $user->delete();
        return response()->json(['message' => 'User deleted']);
    }
}