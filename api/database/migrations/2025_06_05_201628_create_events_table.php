<?php


use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;


return new class extends Migration
{
   public function up(): void
   {
       DB::statement("CREATE TYPE name_event AS ENUM (
           'Criação do Processo',
           'Atualização de Dados',
           'Anexação de Documento',
           'Mudança de Status',
           'Comentário Adicionado'
       )");
      
       Schema::create('events', function (Blueprint $table) {
           $table->id();
           $table->string('name');
           $table->foreignId('user_id')->constrained('users')->restrictOnDelete()->cascadeOnUpdate();
           $table->foreignId('proc_id')->constrained('procs')->cascadeOnDelete()->cascadeOnUpdate();
           $table->boolean('active')->default(true);
           $table->timestamps();
       });
      
       DB::statement('ALTER TABLE events ALTER COLUMN name TYPE name_event USING name::name_event');
   }


   public function down(): void
   {
       Schema::dropIfExists('events');
       DB::statement('DROP TYPE IF EXISTS name_event');
   }
};
