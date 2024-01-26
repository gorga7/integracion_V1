document.addEventListener('DOMContentLoaded', function () {
    let btnCrearEnvio = document.getElementById('btnCrearEnvio');
    let Respuesta = document.getElementById('Respuesta');
    let paquetes = [];

    btnCrearEnvio.addEventListener('click', async function (event) {
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

            const response = await fetch(url, requestOptions);

            if (!response.ok) {
                const errorDetails = await response.text();
                throw new Error(`HTTP error! Status: ${response.status}. Details: ${errorDetails}`);
            }

            const responseData = await response.json();

            if (responseData.result === 0) {
                Respuesta.innerText = JSON.stringify(responseData.data, null, 2);

                const imprimirButton = document.createElement('button');
                imprimirButton.innerText = 'Imprimir PEGOTÍN';

                imprimirButton.addEventListener('click', async () => {
                    const getPegoteUrl = 'https://altis-ws.grupoagencia.com:444/JAgencia/JAgencia.asmx/wsGetPegote';
                    const numeroRastreo = responseData.data.Codigo_Rastreo;
                
                    if (numeroRastreo) {
                        const K_Oficina = numeroRastreo.substring(0, 3);
                        const K_Guia = numeroRastreo.substring(3);
                
                        const idSession = localStorage.getItem('ID_Session');
                
                        const getPegoteParams = {
                            K_Oficina,
                            K_Guia,
                            ID_Sesion: idSession,
                            CodigoPedido: ""
                        };
                
                        const getPegoteOptions = {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Host': 'altis-ws.grupoagencia.com',
                            },
                            mode: 'cors',
                            body: JSON.stringify(getPegoteParams),
                        };
                
                        try {
                            const pegoteResponse = await fetch(getPegoteUrl, getPegoteOptions);
                
                            if (!pegoteResponse.ok) {
                                throw new Error(`HTTP error! Status: ${pegoteResponse.status}`);
                            }
                
                            const pegoteData = await pegoteResponse.json();
                
                            // Verificar si "Pegote" existe y no es una cadena vacía
                            if (pegoteData.Pegote !== undefined && pegoteData.Pegote !== null && pegoteData.Pegote !== "") {
                                const base64Pdf = pegoteData.Pegote;
                                const pdfData = cleanAndDecodeBase64(base64Pdf);
                
                                // Resto del código para abrir el PDF
                                const arrayBuffer = new ArrayBuffer(pdfData.length);
                                const uint8Array = new Uint8Array(arrayBuffer);
                                for (let i = 0; i < pdfData.length; i++) {
                                    uint8Array[i] = pdfData.charCodeAt(i);
                                }
                
                                const blob = new Blob([arrayBuffer], { type: 'application/pdf' });
                                const pdfUrl = URL.createObjectURL(blob);
                
                                window.open(pdfUrl, '_blank');
                            } else {
                                console.error('Error: El campo "Pegote" está vacío o indefinido');
                            }
                        } catch (error) {
                            console.error('Error al obtener PEGOTÍN:', error.message);
                        }
                    } else {
                        console.error('Error en el servidor: El número de rastreo no está disponible.');
                    }
                });

                document.body.appendChild(imprimirButton);
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

    function cleanAndDecodeBase64(input) {
        if (input === undefined || input === null) {
            console.error('Input is undefined or null');
            return '';
        }
    
        const cleanedInput = input.replace(/[^A-Za-z0-9+/]/g, '');
        const padding = '='.repeat((4 - cleanedInput.length % 4) % 4);
        const paddedInput = cleanedInput + padding;
        return atob(paddedInput);
    }

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