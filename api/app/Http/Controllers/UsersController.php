<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Http\Requests\UserRequest;
use Illuminate\Http\Request;

class UsersController extends Controller
{
    public function index()
    {
        $this->authorize('viewAny', User::class);
        return User::where('active', true)->get();
    }

    public function store(UserRequest $request)
    {
        $this->authorize('create', User::class);
        $data = $request->validated();
        $user = User::create($data);
        return response()->json($user, 201);
    }

    public function show(User $user)
    {
        $this->authorize('view', $user);
        return $user;
    }

    public function update(UserRequest $request, User $user)
    {
        $this->authorize('update', $user);    
        $data = $request->validated();
        $user->update($data);
        return response()->json($user);
    }

    public function destroy(User $user)
    {
        $this->authorize('delete', $user);
        $user->update(['active' => false]);
        return response()->json(['message' => 'Usuário desativado com sucesso']);
    }
}