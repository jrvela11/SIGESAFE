<?php

namespace Database\Factories;

use App\Models\Carrier;
use Illuminate\Database\Eloquent\Factories\Factory;

class CarrierFactory extends Factory
{
    protected $model = Carrier::class;

    public function definition(): array
    {
        return [
            'nombre' => fake()->company() . ' Transportes',
            'ruc_dni' => '20' . fake()->numerify('#########'), 
            'telefono' => fake()->phoneNumber(),
            'estado' => fake()->boolean(90), 
        ];
    }
}