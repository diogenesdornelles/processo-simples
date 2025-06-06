<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Event;
use App\Models\User;

class Proc extends Model
{
    use HasFactory;

    protected $table = 'procs';

    protected $fillable = [
        'user_id',
        'owner',
        'description',
        'status',
        'priority',
        'term',
        'active',
        'number',
    ];

    protected $guarded = [
        'id',
        'created_at',    
        'updated_at', 
    ];

    protected function casts(): array
    {
        return [
            'active' => 'boolean',
            'term' => 'datetime',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function events()
    {
        return $this->hasMany(Event::class, 'proc_id');
    }
}