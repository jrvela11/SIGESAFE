<?php
 
namespace App\Http\Controllers;
 
use App\Models\Envio;
use App\Models\HistorialSeguimiento;
use App\Models\AvisoWhatsapp;
use App\Http\Requests\StoreEnvioRequest;
use App\Http\Requests\UpdateEnvioRequest;
use App\Http\Requests\AgregarSeguimientoRequest;
use App\Http\Requests\CambiarEstadoEnvioRequest;
use App\Http\Resources\EnvioResource;
use App\Services\WhatsAppService;
use Illuminate\Http\JsonResponse;
 
class EnvioController extends Controller
{
    private ?WhatsAppService $whatsapp = null;
 
    public function __construct()
    {
        // Usamos \Throwable para capturar tanto Exception como Error del contenedor.
        // Si WhatsApp no está configurado, el módulo funciona igual sin notificaciones.
        try {
            $service = new WhatsAppService();
            $this->whatsapp = $service;
        } catch (\Throwable $e) {
            $this->whatsapp = null;
        }
    }
 
    public function index(): JsonResponse
    {
        $envios = Envio::with(['venta.cliente', 'agenciaTransporte', 'historial'])
            ->orderBy('created_at', 'desc')
            ->get();
 
        return response()->json([
            'success' => true,
            'data'    => EnvioResource::collection($envios),
        ]);
    }
 
    public function store(StoreEnvioRequest $request): JsonResponse
    {
        $envio = Envio::create($request->validated());
 
        $this->registrarHistorial(
            $envio,
            $request->estado_actual ?? 'preparando',
            'Envío creado. Registro inicial.',
            null
        );
 
        return response()->json([
            'success' => true,
            'message' => 'Envío registrado correctamente.',
            'data'    => new EnvioResource($envio->load(['venta.cliente', 'agenciaTransporte', 'historial'])),
        ], 201);
    }
 
    public function show(Envio $envio): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data'    => new EnvioResource(
                $envio->load(['venta.cliente', 'agenciaTransporte', 'historial'])
            ),
        ]);
    }
 
    public function update(UpdateEnvioRequest $request, Envio $envio): JsonResponse
    {
        $envio->update($request->validated());
 
        return response()->json([
            'success' => true,
            'message' => 'Datos del envío actualizados.',
            'data'    => new EnvioResource(
                $envio->load(['venta.cliente', 'agenciaTransporte', 'historial'])
            ),
        ]);
    }
 
    public function agregarSeguimiento(AgregarSeguimientoRequest $request, Envio $envio): JsonResponse
    {
        $this->registrarHistorial(
            $envio,
            $request->estado,
            $request->descripcion,
            $request->ubicacion
        );
 
        return response()->json([
            'success' => true,
            'message' => 'Seguimiento agregado correctamente.',
        ]);
    }
 
    public function cambiarEstado(CambiarEstadoEnvioRequest $request, Envio $envio): JsonResponse
    {
        $nuevoEstado = $request->estado_actual;
        $envio->update(['estado_actual' => $nuevoEstado]);
 
        $descripcion = $request->descripcion ?? 'Estado actualizado a ' . $nuevoEstado;
        $this->registrarHistorial($envio, $nuevoEstado, $descripcion, $request->ubicacion);
 
        // WhatsApp es opcional: si no está configurado, simplemente no envía
        $this->enviarWhatsAppSiCorresponde($envio, $nuevoEstado);
 
        return response()->json([
            'success' => true,
            'message' => 'Estado actualizado correctamente.',
        ]);
    }
 
    // ─── Métodos privados ─────────────────────────────────────────────────────
 
    private function registrarHistorial(
        Envio $envio,
        string $estado,
        ?string $descripcion = null,
        ?string $ubicacion = null
    ): void {
        HistorialSeguimiento::create([
            'envio_id'    => $envio->id,
            'estado'      => $estado,
            'ubicacion'   => $ubicacion,
            'descripcion' => $descripcion,
        ]);
    }
 
    private function enviarWhatsAppSiCorresponde(Envio $envio, string $estado): void
    {
        // Si WhatsApp no está configurado, no hacemos nada
        if ($this->whatsapp === null) {
            return;
        }
 
        // Necesitamos cargar la relación si no está cargada
        $envio->loadMissing('venta.cliente');
        $cliente = $envio->venta?->cliente ?? null;
 
        if (! $cliente || ! $cliente->telefono) {
            return;
        }
 
        $mensajes = [
            'en_agencia'  => "Hola {$cliente->nombre_completo}, tu pedido fue entregado a la agencia. N° seguimiento: {$envio->numero_seguimiento}",
            'en_transito' => "Hola {$cliente->nombre_completo}, tu pedido está en camino. Código de rastreo: {$envio->numero_seguimiento}.",
            'entregado'   => "Hola {$cliente->nombre_completo}, ¡tu pedido ha sido entregado! Gracias por tu confianza.",
        ];
 
        if (! isset($mensajes[$estado])) {
            return;
        }
 
        $numero  = '51' . ltrim($cliente->telefono, '0');
        $enviado = $this->whatsapp->enviar($numero, $mensajes[$estado]);
 
        AvisoWhatsapp::create([
            'envio_id'        => $envio->id,
            'numero_telefono' => $numero,
            'tipo_mensaje'    => $estado,
            'estado_envio'    => $enviado ? 'enviado' : 'fallido',
        ]);
    }
}