<?php

namespace Tests\Feature\Http\Controllers;

use App\Models\Product;
use App\Models\Purchase;
use App\Models\Supplier;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Carbon;
use JMac\Testing\Traits\AdditionalAssertions;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

/**
 * @see \App\Http\Controllers\PurchaseController
 */
final class PurchaseControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    #[Test]
    public function index_behaves_as_expected(): void
    {
        $purchases = Purchase::factory()->count(3)->create();

        $response = $this->get(route('purchases.index'));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    #[Test]
    public function store_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\PurchaseController::class,
            'store',
            \App\Http\Requests\PurchaseStoreRequest::class
        );
    }

    #[Test]
    public function store_saves_purchase_with_details_and_updates_inventory(): void
    {
        $this->withoutExceptionHandling();
        // 1. Arrange: Preparar el escenario base
        $supplier = Supplier::factory()->create();
        $user = User::factory()->create(); // Asumiendo que usas autenticación

        // Crear un producto afecto a IGV para validar los cálculos matemáticos
        $product = Product::factory()->create([
            'precio_compra' => 10.00,
            'afecto_igv' => true,
            'stock_actual' => 5.00
        ]);

        $tipoComprobante = 'Factura';
        $serie = 'F001';
        $numero = '00000123';

        // Simular el payload exacto que enviará el Frontend (React)
        $payload = [
            'supplier_id' => $supplier->id,
            'user_id' => $user->id,
            'tipo_comprobante' => $tipoComprobante,
            'serie' => $serie,
            'numero' => $numero,
            'metodo_pago' => 'transferencia',
            'fecha_emision' => now()->toDateString(),
            'items' => [
                [
                    'product_id' => $product->id,
                    'cantidad' => 10.00,     // Compramos 10 unidades
                    'precio_compra' => 10.00 // A costo de 10.00 cada una
                ]
            ]
        ];

        // Valores esperados tras los cálculos del controlador
        $subtotalEsperado = 100.00; // 10 * 10
        $igvEsperado = 18.00;       // 100 * 0.18
        $totalEsperado = 118.00;    // 100 + 18

        // 2. Act: Ejecutar la petición HTTP (puedes usar actingAs si requiere auth)
        $response = $this->postJson(route('purchases.store'), $payload);

        // 3. Assert: Validar la respuesta HTTP de la API
        // 3. Assert: Validar la respuesta HTTP de la API (Estructura Plana)
        $response->assertCreated();
        $response->assertJsonStructure([
            'data' => [
                'id',
                'supplier_id',
                'tipo_comprobante',
                'serie',
                'numero',
                'fecha_emision',
                'subtotal',
                'igv',
                'total',
                'estado',
            ]
        ]);
        // 4. Assert: Validar la persistencia de la Cabecera en la Base de Datos
        $this->assertDatabaseHas('purchases', [
            'supplier_id' => $supplier->id,
            'tipo_comprobante' => $tipoComprobante,
            'serie' => $serie,
            'numero' => $numero,
            'subtotal' => $subtotalEsperado,
            'igv' => $igvEsperado,
            'total' => $totalEsperado,
            'estado' => true,
        ]);

        // Retrieve la compra creada para validar relaciones internas
        $purchase = Purchase::first();

        // 5. Assert: Validar que se guardó el detalle correctamente
        $this->assertDatabaseHas('purchase_details', [
            'purchase_id' => $purchase->id,
            'product_id' => $product->id,
            'cantidad' => 10.00,
            'precio_compra' => 10.00,
            'subtotal' => $subtotalEsperado
        ]);

        // 6. Assert: Validar la entrada de Inventario (Lote Nuevo)
        // 6. Assert: Validar la entrada de Inventario (Lote Nuevo) con la estructura real
        $this->assertDatabaseHas('inventories', [
            'product_id'       => $product->id,
            'proveedor_id'     => $supplier->id,
            'codigo_lote'      => "LOTE-{$serie}-{$numero}-P{$product->id}",
            'cantidad_inicial' => 10.00,
            'cantidad_actual'  => 10.00,
            'precio_compra'    => 10.00,
            'fecha_ingreso'    => now()->toDateString(),
            'estado'           => true
        ]);

        // 7. Assert: Validar el Kardex (Movimiento de entrada)
        $this->assertDatabaseHas('inventory_movements', [
            'tipo' => 'entrada',
            'cantidad' => 10.00,
            'purchase_detail_id' => $purchase->details->first()->id // Validando tu nueva relación
        ]);

        // 8. Assert: Validar que el stock global del maestro de productos se incrementó
        $product->refresh();
        $this->assertEquals(15.00, $product->stock_actual); // 5.00 iniciales + 10.00 comprados
    }


    #[Test]
    public function show_behaves_as_expected(): void
    {
        $purchase = Purchase::factory()->create();

        $response = $this->get(route('purchases.show', $purchase));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }




    #[Test]
    public function destroy_deletes_and_responds_with(): void
    {
        $purchase = Purchase::factory()->create();

        $response = $this->delete(route('purchases.destroy', $purchase));

        $response->assertNoContent();

        $this->assertModelMissing($purchase);
    }
}
