<?php

namespace Database\Seeders;

use App\Models\Course;
use Illuminate\Database\Seeder;

class CourseSeeder extends Seeder
{
    public function run(): void
    {
        $courses = [
            ['code' => 'BSIT',  'name' => 'BS Information Technology',      'department' => 'IT'],
            ['code' => 'BSCS',  'name' => 'BS Computer Science',            'department' => 'IT'],
            ['code' => 'BSCpE', 'name' => 'BS Computer Engineering',        'department' => 'Engineering'],
            ['code' => 'BSECE', 'name' => 'BS Electronics Engineering',     'department' => 'Engineering'],
            ['code' => 'BSCE',  'name' => 'BS Civil Engineering',           'department' => 'Engineering'],
            ['code' => 'BSA',   'name' => 'BS Accountancy',                 'department' => 'Business'],
            ['code' => 'BSBA',  'name' => 'BS Business Administration',     'department' => 'Business'],
            ['code' => 'BSED',  'name' => 'BS Education',                   'department' => 'Education'],
            ['code' => 'BEED',  'name' => 'Bachelor of Elementary Education','department' => 'Education'],
            ['code' => 'BSHRM', 'name' => 'BS Hospitality Management',      'department' => 'Business'],
        ];

        foreach ($courses as $course) {
            Course::updateOrCreate(
                ['code' => $course['code']],
                $course + ['units' => 3]
            );
        }

        $existingCount = Course::count();
        for ($i = $existingCount + 1; $i <= 20; $i++) {
            Course::updateOrCreate(
                ['code' => 'C' . str_pad((string) $i, 3, '0', STR_PAD_LEFT)],
                [
                    'name' => 'Sample Course ' . $i,
                    'department' => fake()->randomElement(['IT', 'Business', 'Education', 'Engineering']),
                    'units' => 3,
                ]
            );
        }
    }
}

