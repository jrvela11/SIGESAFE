<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ClienteController;
use App\Http\Controllers\CategoriaController; 
use App\Http\Controllers\EmpleadoController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ProductoController;
use App\Http\Controllers\ConsultaDocumentoController;
use App\Http\Controllers\VentaController;
use App\Http\Controllers\ProveedorController;
use App\Http\Controllers\ConfiguracionController;
use App\Http\Controllers\AgenciaTransporteController;
use App\Http\Controllers\EnvioController;



Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// --- MÓDULO MAPAS ---
Route::get('/clientes/mapa', [ClienteController::class, 'mapa']);
Route::get('/clientes/{cliente}/ubicacion', [ClienteController::class, 'ubicacion']);
Route::get('/proveedores/mapa', [ProveedorController::class, 'mapa']);
Route::get('/proveedores/{proveedor}/ubicacion', [ProveedorController::class, 'ubicacion']);
Route::get('/clientes/agrupados', [ClienteController::class, 'agrupados']);
Route::get('/proveedores/agrupados', [ProveedorController::class, 'agrupados']);

// --- CLIENTES ---
Route::put('/clientes/{id}/restaurar', [ClienteController::class, 'restaurar']);
Route::apiResource('clientes', ClienteController::class);

// --- CATEGORÍAS ---
Route::put('/categorias/{id}/restaurar', [CategoriaController::class, 'restaurar']);
Route::apiResource('categorias', CategoriaController::class);

// --- MÓDULO EMPLEADOS ---
Route::put('/empleados/{id}/restaurar', [EmpleadoController::class, 'restaurar']);
Route::apiResource('empleados', EmpleadoController::class);

// --- MÓDULO USUARIOS ---
Route::put('/users/{id}/restaurar', [UserController::class, 'restaurar']);
Route::apiResource('users', UserController::class);

// --- MÓDULO PRODUCTOS ---
Route::put('/productos/{id}/restaurar', [ProductoController::class, 'restaurar']);
Route::apiResource('productos', ProductoController::class);

// --- CONSULTA DE DOCUMENTOS Api---
Route::get('/consultar-documento', [ConsultaDocumentoController::class, 'consultar']);

// --- MÓDULO VENTAS ---
Route::post('/ventas', [VentaController::class, 'store']);
Route::get('/ventas', [VentaController::class, 'index']);

// --- PROVEEDORES ---
Route::put('/proveedores/{id}/restaurar', [ProveedorController::class, 'restaurar']);
Route::apiResource('proveedores', ProveedorController::class);

// --- MÓDULO CONFIGURACIONES ---
Route::get('/configuraciones', [ConfiguracionController::class, 'index']);
Route::put('/configuraciones', [ConfiguracionController::class, 'update']);


// --- AGENCIAS DE TRANSPORTE ---
Route::apiResource('agencias-transporte', AgenciaTransporteController::class);

// --- ENVÍOS ---
Route::get('/envios', [EnvioController::class, 'index']);
Route::post('/envios', [EnvioController::class, 'store']);
Route::get('/envios/{envio}', [EnvioController::class, 'show']);
Route::put('/envios/{envio}', [EnvioController::class, 'update']);
Route::post('/envios/{envio}/seguimiento', [EnvioController::class, 'agregarSeguimiento']);
Route::put('/envios/{envio}/estado', [EnvioController::class, 'cambiarEstado']);

