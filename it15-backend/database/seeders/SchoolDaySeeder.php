<?php

namespace Database\Seeders;

use App\Models\SchoolDay;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class SchoolDaySeeder extends Seeder
{
    public function run(): void
    {
        $start = Carbon::now()->subMonths(6)->startOfMonth();
        $end   = Carbon::now()->addMonths(1)->endOfMonth();

        for ($date = $start->copy(); $date <= $end; $date->addDay()) {
            $type = 'class_day';
            $description = null;

            if ($date->isWeekend()) {
                $type = 'holiday';
                $description = 'Weekend';
            } elseif (fake()->boolean(5)) {
                $type = 'event';
                $description = fake()->sentence(3);
            }

            $present = $type === 'class_day' ? fake()->numberBetween(300, 500) : null;
            $absent  = $type === 'class_day' ? fake()->numberBetween(0, 80) : null;

            SchoolDay::create([
                'date' => $date->toDateString(),
                'type' => $type,
                'description' => $description,
                'present_students' => $present,
                'absent_students'  => $absent,
            ]);
        }
    }
}

