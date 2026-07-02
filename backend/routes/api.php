<?php

use App\Http\Controllers\CustomerController;
use App\Http\Controllers\ReportController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');



Route::get('/reports/export-pdf', [ReportController::class, 'exportPdf']);
Route::get('/customers/verify-document', [CustomerController::class, 'verifyDocument']);
Route::apiResource('customers', App\Http\Controllers\CustomerController::class);




Route::apiResource('categories', App\Http\Controllers\CategoryController::class);

Route::apiResource('products', App\Http\Controllers\ProductController::class);


Route::apiResource('users', App\Http\Controllers\UserController::class);


Route::apiResource('sales', App\Http\Controllers\SaleController::class);


Route::apiResource('suppliers', App\Http\Controllers\SupplierController::class);

Route::apiResource('purchases', App\Http\Controllers\PurchaseController::class);

Route::get('/kardex', [\App\Http\Controllers\KardexController::class, 'index']);


Route::apiResource('carriers', App\Http\Controllers\CarrierController::class);


Route::apiResource('shipments', App\Http\Controllers\ShipmentController::class);

