<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Event;

class Doc extends Model
{
    use HasFactory;

    protected $table = 'docs';

    protected $fillable = [
        'name',
        'description',
        'event_id',
        'uri',
        'ext',
    ];

    protected $guarded = [
        'id',
        'created_at',
    ];

    protected function casts(): array
    {
        return [
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    public function event()
    {
        return $this->belongsTo(Event::class);
    }
}