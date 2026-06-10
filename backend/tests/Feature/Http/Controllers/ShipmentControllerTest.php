<?php

namespace Tests\Feature\Http\Controllers;

use App\Models\Shipment;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use JMac\Testing\Traits\AdditionalAssertions;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

/**
 * @see \App\Http\Controllers\ShipmentController
 */
final class ShipmentControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    #[Test]
    public function index_behaves_as_expected(): void
    {
        $shipments = Shipment::factory()->count(3)->create();

        $response = $this->get(route('shipments.index'));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    #[Test]
    public function store_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\ShipmentController::class,
            'store',
            \App\Http\Requests\ShipmentStoreRequest::class
        );
    }

    #[Test]
    public function store_saves(): void
    {
        // 1. Crear entidades padres reales
        $sale = \App\Models\Sale::factory()->create();
        $carrier = \App\Models\Carrier::factory()->create();

        $tipo_envio = fake()->randomElement(['bus', 'shalom', 'olva']);
        $direccion_destino = fake()->text();
        $costo_envio = fake()->numberBetween(15, 120);
        $estado_actual = fake()->word();
        $estado = fake()->boolean();

        // 2. Ejecutar petición HTTP POST
        $response = $this->post(route('shipments.store'), [
            'sale_id' => $sale->id,
            'carrier_id' => $carrier->id,
            'tipo_envio' => $tipo_envio,
            'direccion_destino' => $direccion_destino,
            'costo_envio' => $costo_envio,
            'estado_actual' => $estado_actual,
            'estado' => $estado,
            'tracking_metadata' => [
                'oficina_destino' => 'Agencia Central Test',
                'clave_seguridad' => 'TST-123'
            ]
        ]);

        // 3. Validar el estado HTTP de la respuesta de la API (201 Created)
        $response->assertCreated();

        // 4. Validar persistencia en la tabla principal de envíos
        $this->assertDatabaseHas('shipments', [
            'sale_id' => $sale->id,
            'carrier_id' => $carrier->id,
            'tipo_envio' => $tipo_envio,
            'direccion_destino' => $direccion_destino,
            'costo_envio' => $costo_envio,
            'estado_actual' => $estado_actual,
            'estado' => $estado,
        ]);

        // 🚀 AJUSTE SENIOR: Capturamos el envío recién creado para verificar su historial
        $shipment = \App\Models\Shipment::latest('id')->first();

        // 5. Validar que el hito inicial se guardó correctamente en la tabla de historiales
        $this->assertDatabaseHas('shipment_histories', [
            'shipment_id' => $shipment->id,
            'estado'      => $estado_actual,
            'ubicacion'   => 'Oficina de Origen / Almacén Central',
        ]);

        // 6. Validar la estructura del JSON que retorna tu Resource
        $response->assertJsonStructure([
            'data' => [
                'id',
                'tipo_envio',
                'direccion_destino',
                'costo_envio',
                'tracking_metadata'
            ]
        ]);
    }


    #[Test]
    public function show_behaves_as_expected(): void
    {
        $shipment = Shipment::factory()->create();

        $response = $this->get(route('shipments.show', $shipment));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    #[Test]
    public function update_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\ShipmentController::class,
            'update',
            \App\Http\Requests\ShipmentUpdateRequest::class
        );
    }

    #[Test]
    public function update_behaves_as_expected(): void
    {
        // 1. Creamos el envío original que vamos a intentar actualizar
        $shipment = Shipment::factory()->create();

        // 2. Creamos nuevas instancias en la BD para simular el cambio de Venta y Carrier
        $sale = \App\Models\Sale::factory()->create();
        $carrier = \App\Models\Carrier::factory()->create();

        // 3. Forzamos datos válidos según tus reglas en español y los límites de la BD
        $tipo_envio = fake()->randomElement(['bus', 'shalom', 'olva']);
        $direccion_destino = fake()->address();
        $costo_envio = fake()->randomFloat(2, 10, 150); // Evita números masivos rotos por el decimal(10,2)
        $estado_actual = 'en_camino';
        $estado = fake()->boolean();

        // 4. Ejecutamos la petición PUT enviando el payload limpio y estructurado
        $response = $this->put(route('shipments.update', $shipment), [
            'sale_id' => $sale->id,              // Pasamos el ID real int
            'carrier_id' => $carrier->id,        // Pasamos el ID real int
            'tipo_envio' => $tipo_envio,         // Pasamos el valor real del enum
            'direccion_destino' => $direccion_destino,
            'costo_envio' => $costo_envio,
            'estado_actual' => $estado_actual,
            'estado' => $estado,
            'tracking_metadata' => [             // Incluimos el JSON obligatorio
                'oficina_destino' => 'Agencia Sucursal Test',
                'clave_seguridad' => 'UPD-99'
            ]
        ]);

        // 5. Refrescamos el modelo en memoria con lo que realmente se guardó en la BD
        $shipment->refresh();

        // 6. Aserciones de respuesta de la API
        $response->assertOk(); // Valida código HTTP 200
        $response->assertJsonStructure([
            'data' => [
                'id',
                'tipo_envio',
                'direccion_destino',
                'costo_envio',
                'tracking_metadata'
            ]
        ]);

        // 7. Aserciones de base de datos usando las propiedades de los objetos creados
        $this->assertEquals($sale->id, $shipment->sale_id);
        $this->assertEquals($carrier->id, $shipment->carrier_id);
        $this->assertEquals($tipo_envio, $shipment->tipo_envio);
        $this->assertEquals($direccion_destino, $shipment->direccion_destino);
        $this->assertEquals($costo_envio, $shipment->costo_envio);
        $this->assertEquals($estado_actual, $shipment->estado_actual);
        $this->assertEquals($estado, $shipment->estado);
    }


    #[Test]
    public function destroy_deletes_and_responds_with(): void
    {
        $shipment = Shipment::factory()->create();

        $response = $this->delete(route('shipments.destroy', $shipment));

        $response->assertNoContent();

        $this->assertSoftDeleted($shipment);
    }
}
