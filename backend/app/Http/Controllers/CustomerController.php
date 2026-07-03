<?php

namespace App\Http\Controllers;

use App\Http\Requests\CustomerStoreRequest;
use App\Http\Requests\CustomerUpdateRequest;
use App\Http\Resources\CustomerCollection;
use App\Http\Resources\CustomerResource;
use App\Models\Customer;
use App\Services\DocumentService;
use App\Services\GeocodingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class CustomerController extends Controller
{
    public function index(Request $request)
    {
        $customers = Customer::all();
        return new CustomerCollection($customers);
    }

    public function store(CustomerStoreRequest $request)
    {
        $data = $request->validated();
        
        // Asignamos las coordenadas de forma segura
        $data = $this->asignarCoordenadas($data);

        $customer = Customer::create($data);
        return new CustomerResource($customer);
    }

    public function show(Request $request, Customer $customer)
    {
        return new CustomerResource($customer);
    }

    public function update(CustomerUpdateRequest $request, Customer $customer)
    {
        $data = $request->validated();
        
        // Al actualizar también recalculamos las coordenadas
        $data = $this->asignarCoordenadas($data);

        $customer->update($data);
        return new CustomerResource($customer);
    }

    public function destroy(Request $request, Customer $customer): Response
    {
        $customer->delete();
        return response()->noContent();
    }

    public function verifyDocument(Request $request, DocumentService $documentService): JsonResponse
    {
        $request->validate([
            'tipo'   => 'required|string|in:dni,ruc,DNI,RUC',
            'numero' => 'required|string|digits_between:8,11',
        ]);

        $resultado = $documentService->consultar($request->input('tipo'), $request->input('numero'));

        if (!$resultado) {
            return response()->json([
                'success' => false,
                'message' => 'No se pudieron obtener los datos del documento.'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data'    => $resultado
        ]);
    }

    private function asignarCoordenadas(array $data): array
    {
        // Llamamos al servicio internamente para no romper la inyección de rutas
        $geoService = app(GeocodingService::class);

        $distrito = $data['distrito'] ?? '';
        $provincia = $data['provincia'] ?? '';
        $departamento = $data['departamento'] ?? '';
        $calle = preg_replace('/,+/', ',', $data['direccion'] ?? '');

        // Plan A: Dirección completa + Perú
        $queryA = trim("$calle, $distrito, $departamento, Perú", ', ');
        $queryA = preg_replace('/,+/', ',', $queryA);
        $coordenadas = $geoService->obtenerCoordenadas($queryA);

        // Plan B: Si la calle tiene formato raro y falla, buscamos solo el distrito
        if (!$coordenadas && !empty($distrito)) {
            $queryB = trim("$distrito, $provincia, $departamento, Perú", ', ');
            $queryB = preg_replace('/,+/', ',', $queryB);
            $coordenadas = $geoService->obtenerCoordenadas($queryB);
        }

        // Plan C: Si el distrito es remoto y no aparece, ubicamos en el departamento
        if (!$coordenadas && !empty($departamento)) {
            $queryC = trim("$departamento, Perú", ', ');
            $coordenadas = $geoService->obtenerCoordenadas($queryC);
        }

        if ($coordenadas) {
            $data['latitud'] = $coordenadas['latitud'];
            $data['longitud'] = $coordenadas['longitud'];
        } else {
            // Si el mapa rechaza todas las opciones, forzamos null
            $data['latitud'] = null;
            $data['longitud'] = null;
        }

        return $data;
    }
}