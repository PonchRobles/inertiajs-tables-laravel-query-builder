<?php

use Illuminate\Support\Facades\Route;
use Workbench\App\Http\Controllers\ProductController;
use Workbench\App\Http\Middleware\HandleInertiaRequests;

Route::middleware(HandleInertiaRequests::class)->group(function () {
    Route::redirect('/', '/products');
    Route::get('/products', [ProductController::class, 'index']);
    Route::get('/two-tables', [ProductController::class, 'twoTables']);
});
