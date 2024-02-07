document.addEventListener('DOMContentLoaded', function () {
    let btnCrearEnvio = document.getElementById('btnCrearEnvio');
    let Respuesta = document.getElementById('Respuesta');
    let paquetes = [];

    btnCrearEnvio.addEventListener('click', async function (event) {
        event.preventDefault();
        try {
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
            const CodigoPedido = document.getElementById('CodigoPedido').value; // Obtener CodigoPedido

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
                Detalle_Paquetes: JSON.stringify(getPaquetes()),
                Observaciones: document.getElementById('Observaciones').value,
                CostoMercaderia: document.getElementById('CostoMercaderia').value,
                Referencia_Pago: document.getElementById('Referencia_Pago').value,
                CodigoPedido, // Agregar CodigoPedido
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

            const response = await fetch(url, requestOptions);

            if (!response.ok) {
                const errorDetails = await response.text();
                throw new Error(`HTTP error! Status: ${response.status}. Details: ${errorDetails}`);
            }

            const responseData = await response.json();

            if (responseData.result === 0) {
                Respuesta.innerText = JSON.stringify(responseData.data, null, 2);
            } else {
                console.error('Error en el servidor:', responseData.data);
                Respuesta.innerText = 'Error en el servidor: ' + responseData.data;
            }
        } catch (error) {
            if (error instanceof TypeError && error.message.includes('500')) {
                console.error('Error en el servidor (500 Internal Server Error). Detalles:', error.message);
            } else {
                console.error('Error:', error.message);
                Respuesta.innerText = 'Error desconocido: ' + error.message;
            }
        }
        handleResponse();
    });

    async function handleResponse() {
        try {
            // El código para enviar la solicitud y manejar la respuesta va aquí
        } catch (error) {
            console.error('Error:', error.message);
            Respuesta.innerText = 'Error desconocido: ' + error.message;
        }
    }
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

    // Función para obtener el Pegote
    async function obtenerPegote() {
        try {
            // Obtener los parámetros necesarios para obtener el pegote
            const K_Oficina = document.getElementById('K_Oficina').value;
            const K_Guia = document.getElementById('K_Guia').value;
            const CodigoPedido = document.getElementById('CodigoPedidoPegote').value; // Obtener CodigoPedido
            const ID_Sesion = localStorage.getItem('ID_Session');
    
            // Configurar la petición para obtener el pegote
            const getPegoteUrl = 'https://altis-ws.grupoagencia.com:444/JAgencia/JAgencia.asmx/wsGetPegote';
            const getPegoteParams = {
                K_Oficina: document.getElementById('K_Oficina').value,
                K_Guia: document.getElementById('K_Guia').value,
                CodigoPedido: document.getElementById('CodigoPedidoPegote').value,
                ID_Sesion: localStorage.getItem('ID_Session')
            };
            const getPegoteOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Host': 'altis-ws.grupoagencia.com',
                },
                mode: 'cors',
                body: JSON.stringify(getPegoteParams), // Enviar el objeto JSON como cuerpo de la solicitud
            };
    
            // Realizar la petición para obtener el pegote
            const pegoteResponse = await fetch(getPegoteUrl, getPegoteOptions);
    
            // Verificar la respuesta del servidor
            if (!pegoteResponse.ok) {
                throw new Error(`HTTP error! Status: ${pegoteResponse.status}`);
            }
    
            // Obtener los datos de la respuesta del servidor
            const pegoteData = await pegoteResponse.json();
    
            // Mostrar la respuesta en la consola
            console.log('Respuesta de wsGetPegote:', pegoteData);
    
            // Verificar si pegoteData es undefined o si no contiene datos válidos
            if (!pegoteData || !pegoteData.data || !pegoteData.data.Pegote) {
                throw new Error('La respuesta del servidor no contiene datos válidos.');
            }
    
            // Obtener el código del pegote y quitar las comillas al principio y al final
            const pegoteCode = pegoteData.data.Pegote.replace(/^"|"$/g, '');
    
            // Convertir el código del pegote a un archivo PDF
            const byteCharacters = atob(pegoteCode);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: 'application/pdf' });
    
            // Crear una URL para el PDF
            const pdfUrl = URL.createObjectURL(blob);
    
            // Crear un enlace de descarga para el PDF
            const link = document.createElement('a');
link.href = pdfUrl;
link.download = pegoteData.data.Nombre || 'pegote.pdf'; // Usar el campo "Nombre" si está disponible, de lo contrario, usar "pegote.pdf" como nombre predeterminado
link.style.display = 'none';
document.body.appendChild(link);
link.click();
document.body.removeChild(link);
        } catch (error) {
            console.error('Error al obtener PEGOTÍN:', error.message);
        }
    }

    // Agregar evento al botón btnObtenerPegote
    document.getElementById('btnObtenerPegote').addEventListener('click', obtenerPegote);

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
    }
});