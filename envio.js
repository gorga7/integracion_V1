let btnCrearEnvio = document.getElementById('btnCrearEnvio');
let Respuesta = document.getElementById('Respuesta');

btnCrearEnvio.addEventListener('click', async function (event) {

    const ID_Sesion = document.getElementById('ID_Sesion').value;
    const K_Tipo_Guia = document.getElementById('K_Tipo_Guia').value;
    const K_Tipo_Envio = document.getElementById('K_Tipo_Envio').value;
    const F_Recoleccion = document.getElementById('F_Recoleccion').value;
    const K_Domicilio_Recoleccion = document.getElementById('K_Domicilio_Recoleccion').value;
    const D_Cliente_Remitente = document.getElementById('D_Cliente_Remitente').value;
    const Telefono_Remitente = document.getElementById('Telefono_Remitente').value;
    const K_Cliente_Destinatario = document.getElementById('K_Cliente_Destinatario').value;
    const Cliente_Destinatario = document.getElementById('Cliente_Destinatario').value;
    const Direccion_Destinatario = document.getElementById('Direccion_Destinatario').value;
    const Telefono = document.getElementById('Telefono').value;
    const RUT = document.getElementById('RUT').value;
    const K_Oficina_Destino = document.getElementById('K_Oficina_Destino').value;
    const Entrega = document.getElementById('Entrega').value;
    const Paquetes_Ampara = document.getElementById('Paquetes_Ampara').value;
    const Detalle_Paquetes = document.getElementById('Detalle_Paquetes').value;
    const Observaciones = document.getElementById('Observaciones').value;
    const CostoMercaderia = document.getElementById('CostoMercaderia').value;
    const Referencia_Pago = document.getElementById('Referencia_Pago').value;
    const CodigoPedido = document.getElementById('CodigoPedido').value;
    const Serv_DDF = document.getElementById('Serv_DDF').value;
    const Serv_Cita = document.getElementById('Serv_Cita').value;
    const Latitud_Destino = document.getElementById('Latitud_Destino').value;
    const Longitud_Destino = document.getElementById('Longitud_Destino').value;


    const jsonData = {
        ID_Sesion,
        K_Tipo_Guia,
        K_Tipo_Envio,
        F_Recoleccion,
        K_Domicilio_Recoleccion,
        D_Cliente_Remitente,
        Telefono_Remitente,
        K_Cliente_Destinatario,
        Cliente_Destinatario,
        Direccion_Destinatario,
        Telefono,
        RUT,
        K_Oficina_Destino,
        Entrega,
        Paquetes_Ampara,
        Detalle_Paquetes: JSON.stringify([{ Cantidad: "1", Tipo: "1" }]),
        Observaciones,
        CostoMercaderia,
        Referencia_Pago,
        CodigoPedido,
        Serv_DDF,
        Serv_Cita,
        Latitud_Destino,
        Longitud_Destino
    };

    const url = 'https://altis-ws.grupoagencia.com:444/JAgencia/JAgencia.asmx/wsInGuia_Levante';

    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Host': 'altis-ws.grupoagencia.com',
        },
        mode: 'cors',
        body: JSON.stringify(jsonData),
    };

    try {
        const response = await fetch(url, requestOptions);
        console.log('ID de Sesión:', ID_Sesion);
        if (!response.ok) {
            const errorDetails = await response.text();
            throw new Error(`HTTP error! Status: ${response.status}. Details: ${errorDetails}`);
        }

        const responseData = await response.json();
        console.log('Respuesta del servidor:', responseData);

        if (responseData.result === 0) {
            console.log('Envío creado correctamente:', responseData.data);
            Respuesta.innerText = JSON.stringify(responseData.data, null, 2);
        } else {
            console.error('Error en el servidor:', responseData.data);
            Respuesta.innerText = 'Error en el servidor: ' + responseData.data;
        }
    } catch (error) {
        // Manejar errores de red y otros errores
        console.error('Error:', error.message);
        Respuesta.innerText = 'Error desconocido: ' + error.message;
    }
});