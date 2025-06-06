<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Http\Requests\UserRequest;
use Illuminate\Http\Request;

class UsersController extends Controller
{
    public function index()
    {
        return User::where('active', true)->get();
    }

    public function store(UserRequest $request)
    {
        $data = $request->validated();
        $user = User::create($data);
        return response()->json($user, 201);
    }

    public function show(User $user)
    {
        return $user;
    }

    public function update(UserRequest $request, User $user)
    {
        $data = $request->validated();
        $user->update($data);
        return response()->json($user);
    }

    public function destroy(User $user)
    {
        $user->update(['active' => false]);
        return response()->json(['message' => 'Usuário desativado com sucesso']);
    }
}