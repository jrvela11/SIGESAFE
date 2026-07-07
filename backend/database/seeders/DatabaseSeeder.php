<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            CategorySeeder::class,
            ProductSeeder::class,
            CustomerSeeder::class,
            UserSeeder::class,
            SaleSeeder::class,
            SaleDetailSeeder::class,
            SupplierSeeder::class,
            PurchaseSeeder::class,
            CarrierSeeder::class,
            ShipmentSeeder::class
        ]);
    }
}