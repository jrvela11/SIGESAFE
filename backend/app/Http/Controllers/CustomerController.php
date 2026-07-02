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

    public function store(CustomerStoreRequest $request, GeocodingService $geoService)
    {
        // 1. Obtenemos los datos ya validados
        $data = $request->validated();

        // 2. Construimos una cadena libre (Free-form query) bien formateada
        // Ejemplo resultante: "Calle Cahuide 385, Bagua, Bagua, Amazonas"
        $direccionCompleta = sprintf(
            '%s, %s, %s, %s',
            $data['direccion'] ?? '',    // Tu calle y número ("Cahuide 385")
            $data['distrito'] ?? '',     // "Bagua"
            $data['provincia'] ?? '',    // "Bagua"
            $data['departamento'] ?? ''  // "Amazonas"
        );

        // 3. Consultamos usando tu función existente 'obtenerCoordenadas'
        $coordenadas = $geoService->obtenerCoordenadas($direccionCompleta);

        // 4. Si la API de OpenStreetMap devuelve las coordenadas, las asignamos
        if ($coordenadas) {
            $data['latitud'] = $coordenadas['latitud'];
            $data['longitud'] = $coordenadas['longitud'];
        }

        // 5. Creamos el registro en la base de datos
        $customer = Customer::create($data);

        // 6. Retornamos la respuesta mapeada con el Resource
        return new CustomerResource($customer);
    }

    public function show(Request $request, Customer $customer)
    {
        return new CustomerResource($customer);
    }

    public function update(CustomerUpdateRequest $request, Customer $customer)
    {
        $customer->update($request->validated());

        return new CustomerResource($customer);
    }

    public function destroy(Request $request, Customer $customer): Response
    {
        $customer->delete();

        return response()->noContent();
    }



    public function verifyDocument(Request $request, DocumentService $documentService): JsonResponse
    {
        // 1. Validamos parámetros
        $request->validate([
            'tipo'   => 'required|string|in:dni,ruc,DNI,RUC',
            'numero' => 'required|string|digits_between:8,11',
        ]);

        // 2. Ejecutamos la consulta mediante el servicio
        $resultado = $documentService->consultar(
            $request->input('tipo'),
            $request->input('numero')
        );

        // 3. Si la API externa falla o no encuentra el documento
        if (!$resultado) {
            return response()->json([
                'success' => false,
                'message' => 'No se pudieron obtener los datos del documento.'
            ], 404);
        }

        // 4. Retornamos los datos limpios mapeados por tu servicio
        return response()->json([
            'success' => true,
            'data'    => $resultado
        ]);
    }
}
