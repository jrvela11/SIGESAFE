<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class WhatsAppService
{
    protected string $token;
    protected string $phoneNumberId;

    
    public function __construct()
    {
        $this->token = config('services.whatsapp.token', '');
        $this->phoneNumberId = config('services.whatsapp.phone_number_id', '');
        if (empty($this->token)) {
            Log::warning('WhatsApp token no configurado. Las notificaciones no se enviarán.');
        }
    }

    public function enviar(string $to, string $message): bool
    {
        if (empty($this->token)) {
            Log::warning('WhatsApp token no configurado.');
            return false;
        }

        try {
            $response = Http::withToken($this->token)
                ->timeout(10)
                ->post("https://graph.facebook.com/v17.0/{$this->phoneNumberId}/messages", [
                    'messaging_product' => 'whatsapp',
                    'to'   => $to,
                    'type' => 'text',
                    'text' => ['body' => $message],
                ]);

            if ($response->successful()) {
                Log::info('WhatsApp enviado a ' . $to);
                return true;
            }

            Log::error('WhatsApp falló: ' . $response->body());
            return false;
        } catch (\Exception $e) {
            Log::error('WhatsApp error: ' . $e->getMessage());
            return false;
        }
    }
}