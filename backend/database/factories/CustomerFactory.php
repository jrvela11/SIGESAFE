<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class CustomerFactory extends Factory
{
    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        // Elegimos un tipo de documento al azar
        $tipoDoc = fake()->randomElement(['DNI', 'RUC', 'CE']);
        
        // Generamos un número de documento coherente al tipo
        $numDoc = $tipoDoc === 'DNI' ? fake()->numerify('########') : fake()->numerify('20#########');

        return [
            'tipo_documento' => $tipoDoc,
            'numero_documento' => $numDoc,
            // fake()->firstName() o company() genera nombres reales legibles
            'nombre' => fake()->firstName(), 
            'apellido' => fake()->lastName(),
            'email' => fake()->unique()->safeEmail(),
            // Genera un número de 9 dígitos que empieza con 9, ideal para tu validación
            'telefono' => fake()->numerify('9########'),
            'direccion' => fake()->streetAddress(),
            'distrito' => fake()->city(),
            'provincia' => fake()->city(),
            'departamento' => fake()->state(),
            // 85% de probabilidad de que el cliente esté activo (es más realista)
            'estado' => fake()->boolean(85),
        ];
    }
}