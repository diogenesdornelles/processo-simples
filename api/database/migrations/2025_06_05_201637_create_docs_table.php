<?php


use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;


return new class extends Migration
{
   public function up(): void
   {
       Schema::create('docs', function (Blueprint $table) {
           $table->id();
           $table->string('name', 128);
           $table->text('description')->nullable();
           $table->foreignId('event_id')->constrained('events')->cascadeOnDelete()->cascadeOnUpdate();
           $table->text('uri');
           $table->string('ext', 6);
           $table->timestamps();
       });
   }

   public function down(): void
   {
       Schema::dropIfExists('docs');
   }
};
