<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\Proc;
use App\Models\Doc;

class Event extends Model
{
    use HasFactory;

    protected $table = 'events';

    protected $fillable = [
        'active',
    ];

    protected $guarded = [
        'id',
        'name',
        'user_id',
        'proc_id',
        'created_at',
    ];

    protected function casts(): array
    {
        return [
            'active' => 'boolean',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function processo()
    {
        return $this->belongsTo(Proc::class, 'proc_id');
    }

    public function documents()
    {
        return $this->hasMany(Doc::class, 'event_id');
    }
}