<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');



Route::apiResource('customers', App\Http\Controllers\CustomerController::class);

Route::apiResource('categories', App\Http\Controllers\CategoryController::class);

Route::apiResource('products', App\Http\Controllers\ProductController::class);


Route::apiResource('users', App\Http\Controllers\UserController::class);


Route::apiResource('sales', App\Http\Controllers\SaleController::class)->except('update');

Route::apiResource('suppliers', App\Http\Controllers\SupplierController::class);
