<?php

namespace Workbench\App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Workbench\Database\Factories\ProductFactory;

class Product extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $casts = [
        'price'       => 'float',
        'is_active'   => 'boolean',
        'released_at' => 'date:Y-m-d',
    ];

    protected static function newFactory(): ProductFactory
    {
        return ProductFactory::new();
    }
}
