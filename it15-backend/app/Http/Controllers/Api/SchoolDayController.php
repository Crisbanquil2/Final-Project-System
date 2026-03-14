<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SchoolDay;
use Illuminate\Http\JsonResponse;

class SchoolDayController extends Controller
{
    public function index(): JsonResponse
    {
        $days = SchoolDay::orderBy('date')->get([
            'id',
            'date',
            'type',
            'present_students',
            'absent_students',
            'description',
        ]);

        return response()->json($days);
    }
}

