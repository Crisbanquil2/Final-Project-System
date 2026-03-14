<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_no',
        'first_name',
        'last_name',
        'gender',
        'age',
        'year_level',
        'department',
        'course_id',
        'enrolled_at',
    ];

    protected $casts = [
        'enrolled_at' => 'date',
    ];

    public function course()
    {
        return $this->belongsTo(Course::class);
    }
}

