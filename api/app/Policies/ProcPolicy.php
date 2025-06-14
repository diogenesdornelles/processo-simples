<?php

namespace App\Policies;

use App\Models\Proc;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class ProcPolicy
{
    public function viewAny(User $user): bool
    {
        return true; 
    }

    public function view(User $user, Proc $proc): bool 
    {
        return true; 
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, Proc $proc): bool
    {
        return $user->role === 'Admin';
    }

    public function delete(User $user, Proc $proc): bool
    {
        return $user->role === 'Admin';
    }

    public function restore(User $user, Proc $proc): bool
    {
        return $user->role === 'Admin';
    }

    public function forceDelete(User $user, Proc $proc): bool
    {
        return $user->role === 'Admin';
    }
}
