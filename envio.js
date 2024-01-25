document.addEventListener('DOMContentLoaded', function () {
    let btnCrearEnvio = document.getElementById('btnCrearEnvio');
    let Respuesta = document.getElementById('Respuesta');
    let paquetes = [];

    btnCrearEnvio.addEventListener('mousedown', async function (event) {
        const ID_Sesion = localStorage.getItem('ID_Session');
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

        // Moví la obtención de los valores aquí

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
            Detalle_Paquetes: JSON.stringify(getPaquetes()), // Obtener los valores justo antes de enviar
            Observaciones: document.getElementById('Observaciones').value,
            CostoMercaderia: document.getElementById('CostoMercaderia').value,
            Referencia_Pago: document.getElementById('Referencia_Pago').value,
            CodigoPedido: document.getElementById('CodigoPedido').value,
            Serv_DDF: document.getElementById('Serv_DDF').value,
            Serv_Cita: document.getElementById('Serv_Cita').value,
            Latitud_Destino: document.getElementById('Latitud_Destino').value,
            Longitud_Destino: document.getElementById('Longitud_Destino').value
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

    document.getElementById('agregarPaquete').addEventListener('click', function () {
        const paqueteDiv = document.createElement('div');
        paqueteDiv.classList.add('paqueteDiv');

        const tipoInput = document.createElement('input');
        tipoInput.type = 'text';
        tipoInput.placeholder = 'Tipo';
        tipoInput.classList.add('tipoPaquete');

        const cantidadInput = document.createElement('input');
        cantidadInput.type = 'number';
        cantidadInput.placeholder = 'Cantidad';
        cantidadInput.classList.add('cantidadPaquete');

        paqueteDiv.appendChild(tipoInput);
        paqueteDiv.appendChild(cantidadInput);

        document.getElementById('paquetesContainer').appendChild(paqueteDiv);
    });

    function getPaquetes() {
        const paquetesDivs = document.querySelectorAll('.paqueteDiv');
        paquetes = [];
    
        paquetesDivs.forEach((div) => {
            const tipoInput = div.querySelector('.tipoPaquete');
            const cantidadInput = div.querySelector('.cantidadPaquete');
    
            const tipo = tipoInput ? tipoInput.value.trim() : "";
            const cantidad = cantidadInput ? parseInt(cantidadInput.value, 10) : 0;
    
            console.log('Tipo:', tipo, 'Cantidad:', cantidad);
    
            if (!isNaN(cantidad) && cantidad > 0) {
                const paquete = { "Cantidad": cantidad };
    
                if (tipo !== "") {
                    paquete.Tipo = tipo;
                }
    
                paquetes.push(paquete);
            }
        });
    
        console.log('Total de paquetes:', paquetes.reduce((total, paquete) => total + paquete.Cantidad, 0));
    
        const cantidadAmpara = parseInt(document.getElementById('Paquetes_Ampara').value, 10);
    
        const totalPaquetes = paquetes.reduce((total, paquete) => total + paquete.Cantidad, 0);
        console.log('Total de paquetes obtenido por la función:', totalPaquetes);
    
        if (totalPaquetes !== cantidadAmpara) {
            console.error('Error: La cantidad de paquetes no coincide con el valor de "Ampara".');
        }
    
        return paquetes;
    }})