<?php

namespace Workbench\Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Workbench\App\Models\Product;

/**
 * @extends Factory<Product>
 */
class ProductFactory extends Factory
{
    protected $model = Product::class;

    public const CATEGORIES = ['electronics', 'books', 'games', 'toys', 'home'];

    public const BRANDS = ['Acme', 'Globex', 'Initech', 'Umbrella', 'Hooli'];

    public function definition(): array
    {
        return [
            'name'        => ucfirst(fake()->unique()->words(2, true)),
            'category'    => fake()->randomElement(self::CATEGORIES),
            'brand'       => fake()->boolean(75) ? fake()->randomElement(self::BRANDS) : null,
            'price'       => fake()->randomFloat(2, 1, 1000),
            'stock'       => fake()->boolean(80) ? fake()->numberBetween(0, 500) : null,
            'is_active'   => fake()->boolean(70),
            'released_at' => fake()->boolean(85) ? fake()->dateTimeBetween('-3 years')->format('Y-m-d') : null,
        ];
    }
}
