<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class UserFactory extends Factory
{
    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->safeEmail(),
            'email_verified_at' => fake()->dateTime(),
            'password' => fake()->password(),
            'role' => fake()->regexify('[A-Za-z0-9]{50}'),
            'is_active' => fake()->boolean(),
            'remember_token' => fake()->uuid(),
        ];
    }
}
