<?php

namespace App\Providers;
use App\Models\User;
use App\Models\Proc;
use App\Policies\UserPolicy;
use App\Policies\ProcPolicy;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Gate;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Gate::policy(User::class, UserPolicy::class);
        Gate::policy(Proc::class, ProcPolicy::class);
    }
}
