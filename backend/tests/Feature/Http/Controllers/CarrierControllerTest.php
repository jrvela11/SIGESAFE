<?php

namespace Tests\Feature\Http\Controllers;

use App\Models\Carrier;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use JMac\Testing\Traits\AdditionalAssertions;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

/**
 * @see \App\Http\Controllers\CarrierController
 */
final class CarrierControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    #[Test]
    public function index_behaves_as_expected(): void
    {
        $carriers = Carrier::factory()->count(3)->create();

        $response = $this->get(route('carriers.index'));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    #[Test]
    public function store_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\CarrierController::class,
            'store',
            \App\Http\Requests\CarrierStoreRequest::class
        );
    }

    #[Test]
    public function store_saves(): void
    {
        $nombre = fake()->word();
        $estado = fake()->boolean();

        $response = $this->post(route('carriers.store'), [
            'nombre' => $nombre,
            'estado' => $estado,
        ]);

        $carriers = Carrier::query()
            ->where('nombre', $nombre)
            ->where('estado', $estado)
            ->get();
        $this->assertCount(1, $carriers);
        $carrier = $carriers->first();

        $response->assertCreated();
        $response->assertJsonStructure([]);
    }


    #[Test]
    public function show_behaves_as_expected(): void
    {
        $carrier = Carrier::factory()->create();

        $response = $this->get(route('carriers.show', $carrier));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    #[Test]
    public function update_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\CarrierController::class,
            'update',
            \App\Http\Requests\CarrierUpdateRequest::class
        );
    }

    #[Test]
    public function update_behaves_as_expected(): void
    {
        $carrier = Carrier::factory()->create();
        $nombre = fake()->word();
        $estado = fake()->boolean();

        $response = $this->put(route('carriers.update', $carrier), [
            'nombre' => $nombre,
            'estado' => $estado,
        ]);

        $carrier->refresh();

        $response->assertOk();
        $response->assertJsonStructure([]);

        $this->assertEquals($nombre, $carrier->nombre);
        $this->assertEquals($estado, $carrier->estado);
    }


    #[Test]
    public function destroy_deletes_and_responds_with(): void
    {
        $carrier = Carrier::factory()->create();

        $response = $this->delete(route('carriers.destroy', $carrier));

        $response->assertNoContent();

        $this->assertSoftDeleted($carrier);
    }
}
