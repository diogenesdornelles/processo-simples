<?php


use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;


return new class extends Migration
{
   public function up(): void
   {
       DB::statement("CREATE TYPE status_proc AS ENUM ('Aberto', 'Em Andamento', 'Pendente', 'Concluído', 'Cancelado')");
       DB::statement("CREATE TYPE priority_proc AS ENUM ('Alta', 'Média', 'Baixa')");
      
       Schema::create('procs', function (Blueprint $table) {
           $table->id();
           $table->string('number', 20)->unique();
           $table->foreignId('user_id')->constrained('users')->restrictOnDelete()->cascadeOnUpdate();
           $table->text('owner');
           $table->text('description')->nullable();
           $table->string('status');
           $table->string('priority')->nullable();
           $table->timestamp('term');
           $table->boolean('active')->default(true);
           $table->timestamps();
       });


       // Alterar os tipos e aplicar defaults depois
       DB::statement('ALTER TABLE procs ALTER COLUMN status TYPE status_proc USING status::status_proc');
       DB::statement('ALTER TABLE procs ALTER COLUMN status SET DEFAULT \'Aberto\'');
       DB::statement('ALTER TABLE procs ALTER COLUMN priority TYPE priority_proc USING priority::priority_proc');
   }


   public function down(): void
   {
       Schema::dropIfExists('procs');
       DB::statement('DROP TYPE IF EXISTS priority_proc');
       DB::statement('DROP TYPE IF EXISTS status_proc');
   }
};
