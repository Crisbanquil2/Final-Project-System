<?php

namespace Database\Seeders;

use App\Models\Course;
use App\Models\Student;
use Illuminate\Database\Seeder;

class StudentSeeder extends Seeder
{
    public function run(): void
    {
        $courses = Course::all();

        for ($i = 1; $i <= 500; $i++) {
            $course = $courses->random();

            Student::create([
                'student_no' => 'S' . str_pad((string) $i, 5, '0', STR_PAD_LEFT),
                'first_name' => fake()->firstName(),
                'last_name'  => fake()->lastName(),
                'gender'     => fake()->randomElement(['male', 'female']),
                'age'        => fake()->numberBetween(17, 30),
                'year_level' => fake()->randomElement(['1st', '2nd', '3rd', '4th']),
                'department' => $course->department,
                'course_id'  => $course->id,
                'enrolled_at'=> fake()->dateTimeBetween('-1 year', 'now'),
            ]);
        }
    }
}

