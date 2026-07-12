<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserFactory extends Factory
{
    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(), // unique() es importante para que no choquen los correos
            'email_verified_at' => now(),
            'password' => Hash::make('password'), // Contraseña por defecto para los usuarios aleatorios
            'role' => fake()->randomElement(['admin', 'vendedor', 'comprador', 'motorizado']),
            'is_active' => fake()->boolean(90), // 90% de probabilidad de estar activo
            'remember_token' => Str::random(10),
        ];
    }
}
