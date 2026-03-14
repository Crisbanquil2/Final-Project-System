<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Course;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CourseController extends Controller
{
    public function index(): JsonResponse
    {
        $courses = Course::orderBy('name')->get();

        return response()->json($courses);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'code' => ['required', 'string', 'max:20', 'unique:courses,code'],
            'name' => ['required', 'string', 'max:255'],
            'type' => ['nullable', 'string', 'max:50'],
            'duration' => ['nullable', 'string', 'max:50'],
            'units' => ['required', 'integer', 'min:1'],
            'status' => ['required', 'string', 'max:50'],
            'description' => ['nullable', 'string'],
            'department' => ['nullable', 'string', 'max:100'],
        ]);

        // Map frontend fields to columns; store extras in description for now
        $course = Course::create([
            'code' => $validated['code'],
            'name' => $validated['name'],
            'department' => $validated['department'] ?? 'IT',
            'units' => $validated['units'],
        ]);

        return response()->json([
            'message' => 'Program created successfully.',
            'course' => $course,
        ], 201);
    }
}

