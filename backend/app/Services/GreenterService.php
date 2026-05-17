<?php

namespace App\Services;

use Greenter\See;
use Greenter\Ws\Services\SunatEndpoints;

class GreenterService
{
    protected See $see;

    public function __construct()
    {
        $this->see = new See();
        
        $this->see->setCertificate(file_get_contents(storage_path('app/certificado_digital.pem')));

        $this->see->setService(SunatEndpoints::FE_BETA); 
        $this->see->setClaveSOL('20123456789', 'MODDATOS', 'moddatos'); // Datos de prueba genéricos de SUNAT
    }


    public function getSee(): See
    {
        return $this->see;
    }
}