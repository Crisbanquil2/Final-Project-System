<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Student;
use Illuminate\Http\JsonResponse;

class StudentController extends Controller
{
    public function index(): JsonResponse
    {
        $students = Student::with('course')
            ->orderBy('student_no')
            ->get()
            ->map(function (Student $s) {
                return [
                    'id' => $s->id,
                    'student_no' => $s->student_no,
                    'first_name' => $s->first_name,
                    'last_name' => $s->last_name,
                    'gender' => $s->gender,
                    'age' => $s->age,
                    'year_level' => $s->year_level,
                    'department' => $s->department,
                    'course' => $s->course?->name,
                    'enrolled_at' => optional($s->enrolled_at)->toDateString(),
                ];
            });

        return response()->json($students);
    }
}

