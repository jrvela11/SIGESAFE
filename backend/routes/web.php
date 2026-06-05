<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});


Route::resource('customers', App\Http\Controllers\CustomerController::class);

Route::resource('categories', App\Http\Controllers\CategoryController::class);

Route::resource('products', App\Http\Controllers\ProductController::class);


Route::resource('customers', App\Http\Controllers\CustomerController::class)->except('create', 'edit');

Route::resource('categories', App\Http\Controllers\CategoryController::class)->except('create', 'edit');

Route::resource('products', App\Http\Controllers\ProductController::class)->except('create', 'edit');


Route::resource('customers', App\Http\Controllers\CustomerController::class)->except('create', 'edit');

Route::resource('categories', App\Http\Controllers\CategoryController::class)->except('create', 'edit');

Route::resource('products', App\Http\Controllers\ProductController::class)->except('create', 'edit');


Route::resource('customers', App\Http\Controllers\CustomerController::class)->except('create', 'edit');

Route::resource('categories', App\Http\Controllers\CategoryController::class)->except('create', 'edit');

Route::resource('products', App\Http\Controllers\ProductController::class)->except('create', 'edit');


Route::resource('customers', App\Http\Controllers\CustomerController::class)->except('create', 'edit');

Route::resource('categories', App\Http\Controllers\CategoryController::class)->except('create', 'edit');

Route::resource('products', App\Http\Controllers\ProductController::class)->except('create', 'edit');
