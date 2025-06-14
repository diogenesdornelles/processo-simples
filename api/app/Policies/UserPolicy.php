<?php

namespace App\Policies;

use App\Models\User;

class UserPolicy
{
    public function viewAny(User $user): bool
    {
        return true; 
    }

    public function view(User $user, User $model): bool 
    {
        return true; 
    }

    public function create(User $user): bool
    {
        return $user->role === 'Admin';
    }

    public function update(User $user, User $model): bool
    {
        return $user->role === 'Admin';
    }

    public function delete(User $user, User $model): bool
    {
        return $user->role === 'Admin' && $user->id !== $model->id;
    }

    public function restore(User $user, User $model): bool
    {
        return $user->role === 'Admin';
    }

    public function forceDelete(User $user, User $model): bool
    {
        return $user->role === 'Admin' && $user->id !== $model->id;
    }
}