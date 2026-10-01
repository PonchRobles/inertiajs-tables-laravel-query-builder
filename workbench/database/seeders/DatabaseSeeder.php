<?php

namespace Workbench\Database\Seeders;

use Illuminate\Database\Seeder;
use Workbench\App\Models\Product;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        Product::factory()->count(100)->create();
    }
}
