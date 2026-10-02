<?php

namespace PonchRobles\InertiaTable\Tests\Fixtures;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $table = 'products';

    protected $guarded = [];

    public $timestamps = false;
}
