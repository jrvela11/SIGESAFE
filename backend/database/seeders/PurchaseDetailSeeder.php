<?php

namespace Database\Seeders;

use App\Models\PurchaseDetail;
use Illuminate\Database\Seeder;

class PurchaseDetailSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        PurchaseDetail::factory()->count(50)->create();
    }
}
