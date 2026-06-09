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
    public function store_saves(): void
    {
        $this->withoutExceptionHandling();
        $customer = \App\Models\Customer::factory()->create();
        $user = \App\Models\User::factory()->create();

        // 🚀 Ajustamos el factory del producto con tus campos reales del esquema
        $productA = \App\Models\Product::factory()->create([
            'precio_minorista' => 100.00,
            'precio_mayorista' => 85.00,
            'stock_actual'     => 10,
            'afecto_igv'       => true
        ]);

        $productB = \App\Models\Product::factory()->create([
            'precio_minorista' => 50.00,
            'precio_mayorista' => 40.00,
            'stock_actual'     => 5,
            'afecto_igv'       => false // Exonerado/Inafecto de IGV
        ]);

        $tipo_venta = 'minorista'; // El controlador deberá elegir: 100.00 y 50.00
        $tipo_comprobante = 'BOLETA';
        $serie = 'B001';
        $metodo_pago = 'Efectivo';
        $estado_pago = 'pagado';

        $response = $this->post(route('sales.store'), [
            'customer_id'      => $customer->id,
            'user_id'          => $user->id,
            'tipo_venta'       => $tipo_venta,
            'tipo_comprobante' => $tipo_comprobante,
            'serie'            => $serie,
            'metodo_pago'      => $metodo_pago,
            'estado_pago'      => $estado_pago,
            'items' => [
                [
                    'product_id' => $productA->id,
                    'cantidad'   => 2, // 2 * 100.00 = 200.00 (Afecto a IGV)
                    'descuento'  => 0
                ],
                [
                    'product_id' => $productB->id,
                    'cantidad'   => 1, // 1 * 50.00 = 50.00 (Inafecto a IGV)
                    'descuento'  => 0
                ]
            ]
        ]);

        // 🧮 AUDITORÍA MATEMÁTICA:
        // Subtotal = 200.00 + 50.00 = 250.00
        // IGV = Solo aplica a ProductA (200.00 * 0.18) = 36.00
        // Total = 250.00 + 36.00 = 286.00

        $response->assertCreated();

        // Validamos cabecera con cálculos reales por tipo de afectación
        $this->assertDatabaseHas('sales', [
            'customer_id' => $customer->id,
            'tipo_venta'  => $tipo_venta,
            'subtotal'    => 250.00,
            'igv'         => 36.00,
            'total'       => 286.00,
        ]);

        // Validamos que se descontó usando la columna 'stock_actual'
        $this->assertDatabaseHas('products', [
            'id'           => $productA->id,
            'stock_actual' => 8
        ]);

        $this->assertDatabaseHas('products', [
            'id'           => $productB->id,
            'stock_actual' => 4
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
