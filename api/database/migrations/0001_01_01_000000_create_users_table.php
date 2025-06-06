<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Criar o tipo ENUM primeiro
        DB::statement("CREATE TYPE role_user AS ENUM ('Comum', 'Admin')");
        
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name', 128);
            $table->string('password', 128);
            $table->string('role');
            $table->string('email', 128)->unique();
            $table->string('cpf', 11)->unique();
            $table->string('sigle', 5)->unique();
            $table->boolean('active')->default(true);
            $table->timestamps();
        });

        DB::statement('ALTER TABLE "users" ALTER COLUMN role TYPE role_user USING role::role_user');
        DB::statement('ALTER TABLE "users" ALTER COLUMN role SET DEFAULT \'Comum\'');

        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sessions');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('users');
        DB::statement('DROP TYPE IF EXISTS role_user');
    }
};