<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\SchoolDay;
use App\Models\Student;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    public function enrollment(): JsonResponse
    {
        $data = Student::selectRaw('DATE_FORMAT(enrolled_at, "%Y-%m") as month, COUNT(*) as total')
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        return response()->json($data);
    }

    public function courses(): JsonResponse
    {
        $data = Course::select('courses.id', 'courses.name')
            ->selectRaw('COUNT(students.id) as total')
            ->leftJoin('students', 'students.course_id', '=', 'courses.id')
            ->groupBy('courses.id', 'courses.name')
            ->orderBy('courses.name')
            ->get();

        return response()->json($data);
    }

    public function attendance(): JsonResponse
    {
        $data = SchoolDay::orderBy('date')
            ->get(['date', 'type', 'present_students', 'absent_students']);

        return response()->json($data);
    }

    public function summary(): JsonResponse
    {
        return response()->json([
            'students' => Student::count(),
            'courses' => Course::count(),
            'school_days' => SchoolDay::count(),
        ]);
    }
}

