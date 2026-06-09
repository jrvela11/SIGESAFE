<?php

namespace Tests\Feature\Http\Controllers;

use App\Models\Sale;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Carbon;
use JMac\Testing\Traits\AdditionalAssertions;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

/**
 * @see \App\Http\Controllers\SaleController
 */
final class SaleControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    #[Test]
    public function index_behaves_as_expected(): void
    {
        $sales = Sale::factory()->count(3)->create();

        $response = $this->get(route('sales.index'));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    #[Test]
    public function store_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\SaleController::class,
            'store',
            \App\Http\Requests\SaleStoreRequest::class
        );
    }

    #[Test]
    public function store_saves_with_fifo_and_kardex(): void
    {
        $this->withoutExceptionHandling();
        $customer = \App\Models\Customer::factory()->create();
        $user = \App\Models\User::factory()->create();

        // 1. Setup Productos y Lotes (Fuente de la verdad)
        $productA = \App\Models\Product::factory()->create([
            'precio_minorista' => 100.00,
            'stock_actual'     => 10,
            'afecto_igv'       => true
        ]);

        // Creamos dos lotes para ProductA
        $loteAntiguo = \App\Models\Inventory::factory()->create([
            'product_id' => $productA->id,
            'cantidad_actual' => 5,
            'created_at' => now()->subDays(10) // FIFO: Primero este
        ]);
        $loteNuevo = \App\Models\Inventory::factory()->create([
            'product_id' => $productA->id,
            'cantidad_actual' => 5,
            'created_at' => now()
        ]);

        // 2. Ejecutar venta que consume ambos lotes (8 unidades > 5 del primer lote)
        $response = $this->post(route('sales.store'), [
            'customer_id'      => $customer->id,
            'user_id'          => $user->id,
            'tipo_venta'       => 'minorista',
            'tipo_comprobante' => 'BOLETA',
            'serie'            => 'B001',
            'metodo_pago'      => 'Efectivo',
            'estado_pago'      => 'pagado',
            'items' => [
                ['product_id' => $productA->id, 'cantidad' => 8, 'descuento' => 0]
            ]
        ]);

        $response->assertCreated();

        // 3. Verificación FIFO: El antiguo debe quedar en 0, el nuevo en 2 (5-3)
        $this->assertDatabaseHas('inventories', ['id' => $loteAntiguo->id, 'cantidad_actual' => 0]);
        $this->assertDatabaseHas('inventories', ['id' => $loteNuevo->id, 'cantidad_actual' => 2.00]);

        // 4. Verificación de Kardex: Deben existir 2 registros de salida
        $this->assertDatabaseCount('inventory_movements', 2);

        // Verificamos que el movimiento se vinculó correctamente al detalle de venta
        $saleDetail = \App\Models\SaleDetail::where('product_id', $productA->id)->first();
        $this->assertDatabaseHas('inventory_movements', [
            'sale_detail_id' => $saleDetail->id,
            'inventory_id'   => $loteAntiguo->id,
            'cantidad'       => 5,
            'tipo'           => 'salida'
        ]);
    }


    #[Test]
    public function show_behaves_as_expected(): void
    {
        $sale = Sale::factory()->create();

        $response = $this->get(route('sales.show', $sale));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    #[Test]
    public function destroy_deletes_and_responds_with(): void
    {
        $sale = Sale::factory()->create();

        $response = $this->delete(route('sales.destroy', $sale));

        $response->assertNoContent();

        $this->assertSoftDeleted($sale);
    }
}
