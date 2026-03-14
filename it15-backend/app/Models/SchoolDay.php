<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SchoolDay extends Model
{
    use HasFactory;

    protected $fillable = [
        'date',
        'type',
        'present_students',
        'absent_students',
        'description',
    ];

    protected $casts = [
        'date' => 'date',
    ];
}

