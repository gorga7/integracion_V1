// Espera a que el DOM esté completamente cargado antes de ejecutar el código
document.addEventListener("DOMContentLoaded", function () {
  // Selecciona el botón con el ID 'btnCrearEnvio'
  let btnCrearEnvio = document.getElementById("btnCrearEnvio");
  // Selecciona el elemento con el ID 'Respuesta'
  let Respuesta = document.getElementById("Respuesta");
  // Declara un array vacío para almacenar los paquetes
  let paquetes = [];

  let divNombre = document.getElementById("divNombre");
  let pNombre = document.createElement("p");
  pNombre.innerHTML = `Bienvenido, ${localStorage.getItem("Nombre")}`;
  divNombre.appendChild(pNombre);

  //WEBSERVICE INGUIA_LEVANTE PARA CREAR ENVÍO

  // Agrega un event listener al botón de crear envío
  btnCrearEnvio.addEventListener("click", async function (event) {
    // Previene el comportamiento por defecto del evento click (enviar un formulario)
    event.preventDefault();
    try {
      // Obtiene el ID de sesión almacenado en el localStorage
      const ID_Sesion = localStorage.getItem("ID_Session");
      // Obtiene los valores de diferentes campos del formulario
      const K_Tipo_Guia = document.getElementById("K_Tipo_Guia").value;
      const K_Tipo_Envio = document.getElementById("K_Tipo_Envio").value;
      const F_Recoleccion = document.getElementById("F_Recoleccion").value;
      const K_Domicilio_Recoleccion = document.getElementById(
        "K_Domicilio_Recoleccion"
      ).value;
      const D_Cliente_Remitente = document.getElementById(
        "D_Cliente_Remitente"
      ).value;
      const Telefono_Remitente =
        document.getElementById("Telefono_Remitente").value;
      const K_Cliente_Destinatario = document.getElementById(
        "K_Cliente_Destinatario"
      ).value;
      const Cliente_Destinatario = document.getElementById(
        "Cliente_Destinatario"
      ).value;
      const Direccion_Destinatario = document.getElementById(
        "Direccion_Destinatario"
      ).value;
      const Telefono = document.getElementById("Telefono").value;
      const RUT = document.getElementById("RUT").value;
      const K_Oficina_Destino =
        document.getElementById("K_Oficina_Destino").value;
      const Entrega = document.getElementById("Entrega").value;
      const Paquetes_Ampara = document.getElementById("Paquetes_Ampara").value;
      const CodigoPedido = document.getElementById("CodigoPedido").value; // Obtener CodigoPedido

      // Objeto JSON con los datos del formulario y otros datos necesarios
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

        //Campos no obligatorios para generar envíos, por eso los coloqué acá con .value
        Observaciones: document.getElementById("Observaciones").value,
        CostoMercaderia: document.getElementById("CostoMercaderia").value,
        Referencia_Pago: document.getElementById("Referencia_Pago").value,
        CodigoPedido, // Agregar CodigoPedido
        Serv_DDF: document.getElementById("Serv_DDF").value,
        Serv_Cita: document.getElementById("Serv_Cita").value,
        Latitud_Destino: document.getElementById("Latitud_Destino").value,
        Longitud_Destino: document.getElementById("Longitud_Destino").value,
      };

      // URL de la API a la que se enviarán los datos
      const url =
        "https://altis-ws.grupoagencia.com:444/JAgencia/JAgencia.asmx/wsInGuia_Levante";

      // Opciones para la solicitud fetch
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Host: "altis-ws.grupoagencia.com",
        },
        mode: "cors",
        body: JSON.stringify(jsonData), // Convierte el objeto JSON a string
      };

      // Realiza la solicitud fetch a la URL con las opciones proporcionadas
      const response = await fetch(url, requestOptions);

      // Verifica si la respuesta no es satisfactoria (código de estado diferente a 200)
      if (!response.ok) {
        // Obtiene los detalles del error en texto
        const errorDetails = await response.text();
        // Lanza un error con detalles específicos del error HTTP
        throw new Error(
          `HTTP error! Status: ${response.status}. Details: ${errorDetails}`
        );
      }

      // Parsea la respuesta JSON
      const responseData = await response.json();

      // Verifica si el resultado de la respuesta es 0 (éxito)
      if (responseData.result === 0) {
        // Muestra la respuesta formateada en el elemento con ID 'Respuesta'
        Respuesta.innerText = JSON.stringify(responseData.data, null, 2);
      } else {
        // Muestra un mensaje de error si la respuesta no es exitosa
        console.error("Error en el servidor:", responseData.data);
        Respuesta.innerText = "Error en el servidor: " + responseData.data;
      }
    } catch (error) {
      // Captura errores y los maneja
      if (error instanceof TypeError && error.message.includes("500")) {
        // Maneja errores de servidor interno
        console.error(
          "Error en el servidor (500 Internal Server Error). Detalles:",
          error.message
        );
      } else {
        // Maneja otros errores
        console.error("Error:", error.message);
        Respuesta.innerText = "Error desconocido: " + error.message;
      }
    }
    // Llama a la función handleResponse después de manejar la respuesta
    handleResponse();
  });

  // Función asíncrona para manejar la respuesta
  async function handleResponse() {
    try {
      // El código para enviar la solicitud y manejar la respuesta va aquí
    } catch (error) {
      // Maneja errores en la función asíncrona
      console.error("Error:", error.message);
      Respuesta.innerText = "Error desconocido: " + error.message;
    }
  }

  //FUNCION PARA AGREGAR INPUTS PARA LA SOLICITUD DE CANTIDAD DE PAQUETES

  // Agrega un event listener al botón con el ID 'agregarPaquete'
  document
    .getElementById("agregarPaquete")
    .addEventListener("click", function () {
      // Crea un nuevo div para el paquete
      const paqueteDiv = document.createElement("div");
      paqueteDiv.classList.add("paqueteDiv"); // Agrega una clase al div

      // Crea un input para el tipo de paquete
      const tipoInput = document.createElement("input");
      tipoInput.type = "text";
      tipoInput.placeholder = "Tipo"; // Placeholder del input
      tipoInput.classList.add("tipoPaquete"); // Agrega una clase al input

      // Crea un input para la cantidad de paquetes
      const cantidadInput = document.createElement("input");
      cantidadInput.type = "number";
      cantidadInput.placeholder = "Cantidad"; // Placeholder del input
      cantidadInput.classList.add("cantidadPaquete"); // Agrega una clase al input

      // Agrega los inputs al div del paquete
      paqueteDiv.appendChild(tipoInput);
      paqueteDiv.appendChild(cantidadInput);

      // Agrega el div del paquete al contenedor de paquetes
      document.getElementById("paquetesContainer").appendChild(paqueteDiv);
    });

  //FUNCION PARA OBTENER LOS PAQUETES DE FORMA QUE LO PIDE EL WEBSERVICE

  // Define una función llamada getPaquetes que recopila la información de los paquetes del formulario
  function getPaquetes() {
    // Obtiene todos los divs con la clase 'paqueteDiv'
    const paquetesDivs = document.querySelectorAll(".paqueteDiv");
    // Inicializa la variable 'paquetes' como un array vacío
    paquetes = [];

    // Itera sobre cada div de paquete
    paquetesDivs.forEach((div) => {
      // Obtiene el input de tipo y cantidad dentro de cada div de paquete
      const tipoInput = div.querySelector(".tipoPaquete");
      const cantidadInput = div.querySelector(".cantidadPaquete");

      // Obtiene el valor de tipo y cantidad, asegurándose de que estén presentes y eliminando espacios adicionales
      const tipo = tipoInput ? tipoInput.value.trim() : ""; // Valor del tipo de paquete
      const cantidad = cantidadInput ? parseInt(cantidadInput.value, 10) : 0; // Valor de la cantidad de paquetes

      // Imprime en la consola el tipo y cantidad de cada paquete
      console.log("Tipo:", tipo, "Cantidad:", cantidad);

      // Si la cantidad es un número válido y mayor que cero, crea un objeto de paquete y lo agrega al array 'paquetes'
      if (!isNaN(cantidad) && cantidad > 0) {
        const paquete = { Cantidad: cantidad }; // Objeto de paquete con cantidad

        // Si se proporciona un tipo, lo agrega al objeto del paquete
        if (tipo !== "") {
          paquete.Tipo = tipo; // Agrega el tipo de paquete al objeto
        }

        // Agrega el paquete al array 'paquetes'
        paquetes.push(paquete); // Agrega el paquete al array
      }
    });

    // Calcula el total de paquetes sumando las cantidades de todos los paquetes
    console.log(
      "Total de paquetes:",
      paquetes.reduce((total, paquete) => total + paquete.Cantidad, 0)
    );

    // Obtiene la cantidad amparada del input 'Paquetes_Ampara'
    const cantidadAmpara = parseInt(
      document.getElementById("Paquetes_Ampara").value,
      10
    ); // Cantidad amparada

    // Calcula el total de paquetes obtenidos por la función
    const totalPaquetes = paquetes.reduce(
      (total, paquete) => total + paquete.Cantidad,
      0
    );
    console.log("Total de paquetes obtenido por la función:", totalPaquetes);

    // Comprueba si el total de paquetes coincide con la cantidad amparada
    if (totalPaquetes !== cantidadAmpara) {
      console.error(
        'Error: La cantidad de paquetes no coincide con el valor de "Ampara".'
      );
    }

    // Retorna el array 'paquetes' con la información recopilada
    return paquetes;
  }

  //WEBSERVICE GETPEGOTE PARA OBTENER EL PEGOTE DEL ENVÍO CREADO

  // Función asíncrona para obtener el Pegote
  async function obtenerPegote() {
    try {
      // Obtiene los parámetros necesarios para obtener el pegote
      const K_Oficina = document.getElementById("K_Oficina").value;
      const K_Guia = document.getElementById("K_Guia").value;
      const CodigoPedido = document.getElementById("CodigoPedidoPegote").value; // Obtener CodigoPedido
      const ID_Sesion = localStorage.getItem("ID_Session");

      // Configura la petición para obtener el pegote
      const getPegoteUrl =
        "https://altis-ws.grupoagencia.com:444/JAgencia/JAgencia.asmx/wsGetPegote";
      const getPegoteParams = {
        K_Oficina: document.getElementById("K_Oficina").value,
        K_Guia: document.getElementById("K_Guia").value,
        CodigoPedido: document.getElementById("CodigoPedidoPegote").value,
        ID_Sesion: localStorage.getItem("ID_Session"),
      };
      const getPegoteOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Host: "altis-ws.grupoagencia.com",
        },
        mode: "cors",
        body: JSON.stringify(getPegoteParams), // Envía el objeto JSON como cuerpo de la solicitud
      };

      // Realiza la petición para obtener el pegote
      const pegoteResponse = await fetch(getPegoteUrl, getPegoteOptions);

      // Verifica la respuesta del servidor
      if (!pegoteResponse.ok) {
        throw new Error(`HTTP error! Status: ${pegoteResponse.status}`);
      }

      // Obtiene los datos de la respuesta del servidor
      const pegoteData = await pegoteResponse.json();

      // Muestra la respuesta en la consola
      console.log("Respuesta de wsGetPegote:", pegoteData);

      // Verifica si pegoteData es undefined o si no contiene datos válidos
      if (!pegoteData || !pegoteData.data || !pegoteData.data.Pegote) {
        throw new Error("La respuesta del servidor no contiene datos válidos.");
      }

      // Obtiene el código del pegote y quita las comillas al principio y al final
      const pegoteCode = pegoteData.data.Pegote.replace(/^"|"$/g, "");

      // Convierte el código del pegote a un archivo PDF
      const byteCharacters = atob(pegoteCode);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "application/pdf" });

      // Crea una URL para el PDF
      const pdfUrl = URL.createObjectURL(blob);

      // Crea un enlace de descarga para el PDF
      const link = document.createElement("a");
      link.href = pdfUrl;
      link.download = pegoteData.data.Nombre || "pegote.pdf"; // Usa el campo "Nombre" si está disponible, de lo contrario, usa "pegote.pdf" como nombre predeterminado
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      // Maneja errores al obtener el Pegote
      console.error("Error al obtener PEGOTÍN:", error.message);
    }
  }

  // Agrega un evento al botón con el ID 'btnObtenerPegote' que llama a la función obtenerPegote cuando se hace clic
  document
    .getElementById("btnObtenerPegote")
    .addEventListener("click", obtenerPegote);
});

//WEBSERVICE PARA RASTREAR UN ENVÍO

document
  .getElementById("formulario")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Evitar que el formulario se envíe automáticamente

    // Obtener los valores de los campos del formulario
    const K_Oficina_Origen = document.getElementById("K_Oficina_Origen").value;
    const K_GuiaRastreo = document.getElementById("K_GuiaRastreo").value;
    const Referencia = document.getElementById("Referencia").value;
    const ID_Sesion = localStorage.getItem("ID_Session");

    // Construir el objeto con los datos del formulario
    const requestData = {
      K_Oficina_Origen: K_Oficina_Origen,
      K_Guia: K_GuiaRastreo,
      Referencia: Referencia,
      ID_Sesion: ID_Sesion,
    };

    console.log("Datos enviados al servidor:", requestData); // Agregar console.log para mostrar los datos enviados

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Host: "altis-ws.grupoagencia.com",
      },
      mode: "cors",
      body: JSON.stringify(requestData), // Convierte el objeto JSON a string
    };

    // Realizar la solicitud fetch al endpoint proporcionado
    fetch(
      "https://altis-ws.grupoagencia.com:444/JAgencia/JAgencia.asmx/wsRastreoGuia",
      requestOptions
    )
      .then((response) => {
        // Verificar si la respuesta no es satisfactoria (código HTTP diferente a 200)
        if (!response.ok) {
          // Si la respuesta no es satisfactoria, lanzar un error con el código de estado HTTP
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        // Convertir la respuesta del servidor a formato JSON y retornarla
        return response.json();
      })
      .then((data) => {
        document.getElementById("d-tipo-guia").textContent =
          data.data.D_Tipo_Guia;
        document.getElementById("d-tipo-envio").textContent =
          data.data.D_Tipo_Envio;
        document.getElementById("d-tipo-entrega").textContent =
          data.data.D_Tipo_Entrega;
        document.getElementById("cliente-remitente").textContent =
          data.data.Cliente_Remitente;
        document.getElementById("oficina-destino").textContent =
          data.data.Oficina_Destino;
        document.getElementById("destinatario").textContent =
          data.data.Destinatario;
        document.getElementById("estado-guia").textContent =
          data.data.Estado_de_la_Guia;
        document.getElementById("cantidad-paquetes").textContent =
          data.data.Paquetes_Ampara;

        const estadoGuia = document.getElementById("estado-guia");
        estadoGuia.addEventListener("click", () => {
          mostrarHistorial(data.dataHistoria);
        });
      })
      .catch((error) => {
        // Manejar los errores de red y otros errores aquí
        console.error("Error:", error.message);
        // No podemos acceder a 'data' aquí, ya que está fuera del alcance
        // console.log(data)
        // Podríamos mostrar un mensaje de error en algún elemento del DOM si es necesario
        // document.getElementById('respuesta').innerText = 'Error desconocido';
      });
  });

function showResponse(responseData) {
  // Llenar los datos en la tabla
  document.getElementById("cliente-remitente").textContent =
    responseData.clienteRemitente;
  document.getElementById("destinatario").textContent =
    responseData.destinatario;
  document.getElementById("d-tipo-guia").textContent = responseData.dTipoGuia;
  document.getElementById("d-tipo-envio").textContent = responseData.dTipoEnvio;
  document.getElementById("cantidad-paquetes").textContent =
    responseData.cantidadPaquetes;
  document.getElementById("d-tipo-entrega").textContent =
    responseData.dTipoEntrega;
  document.getElementById("oficina-destino").textContent =
    responseData.oficinaDestino;
  document.getElementById("estado-guia").textContent = responseData.estadoGuia;
}

function mostrarHistorial(dataHistoria) {
  // Suponiendo que tienes un elemento HTML donde mostrarás el historial de movimientos de estado
  const historialContainer = document.getElementById("historial-container");
  historialContainer.innerHTML = ""; // Limpiar cualquier contenido previo

  // Crear una tabla para el historial
  const historialTable = document.createElement("table");
  historialTable.classList.add("historial-table");

  // Crear el encabezado de la tabla
  const headerRow = document.createElement("tr");
  const headers = ["Estado", "Oficina", "Fecha y Hora"];
  headers.forEach((headerText) => {
    const th = document.createElement("th");
    th.textContent = headerText;
    headerRow.appendChild(th);
  });
  historialTable.appendChild(headerRow);

  // Iterar sobre cada movimiento en el historial y agregarlo a la tabla
  dataHistoria.forEach((movimiento) => {
    const row = document.createElement("tr");
    const estadoCell = document.createElement("td");
    estadoCell.textContent = movimiento.D_Estado_Guia;
    const oficinaCell = document.createElement("td");
    oficinaCell.textContent = movimiento.D_Oficina;
    const fechaHoraCell = document.createElement("td");
    fechaHoraCell.textContent = movimiento.F_Historia;
    row.appendChild(estadoCell);
    row.appendChild(oficinaCell);
    row.appendChild(fechaHoraCell);
    historialTable.appendChild(row);
  });

  // Agregar la tabla de historial al contenedor
  historialContainer.appendChild(historialTable);
}

document.getElementById("ID_Sesion").value =
  localStorage.getItem("ID_Session") || "";

document.getElementById("enviar").addEventListener("click", function () {
  // Obtener el valor de ID_Sesion actualizado del localStorage
  const ID_Sesion = localStorage.getItem("ID_Session") || "";

  // Verificar si se obtuvo correctamente el valor de ID_Sesion
  if (ID_Sesion) {
    const formData = {
      K_Cliente: document.getElementById("K_Cliente").value,
      Busqueda: document.getElementById("Busqueda").value,
      FI: document.getElementById("FI").value,
      FF: document.getElementById("FF").value,
      RUT: document.getElementById("RUTObtieneCostoCliente").value,
      ID_Sesion: ID_Sesion, // Usar el valor de ID_Sesion obtenido del localStorage
    };

    console.log("Datos a enviar:", formData); // Agregar un console.log para ver los datos antes de enviarlos

    fetch(
      "https://altis-ws.grupoagencia.com:444/JAgencia/JAgencia.asmx/wsObtieneGuiasCliente",
      {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        // Manejar la respuesta del servidor
        console.log(data);
        // Aquí puedes hacer lo que necesites con la respuesta, como mostrarla en la página

        // Verificar si data.result es 0, indicando una respuesta exitosa
        if (data.result === 0) {
          // Mostrar la respuesta en la tabla
          const tablaDatos = document.getElementById("tablaDatos");
          tablaDatos.innerHTML = ""; // Limpiar la tabla antes de agregar nuevas filas

          // Crear filas para cada objeto en la respuesta del servidor
          data.data.forEach((item) => {
            const fila = document.createElement("tr");
            fila.innerHTML = `
            <td>${item.D_Oficina_Origen}</td>
            <td>${item.K_Guia}</td>
            <td>${item.D_Tipo_Guia}</td>
            <td>${item.D_Tipo_Envio}</td>
            <td>${item.F_Documentacion}</td>
            <td>${item.D_Estado_Guia}</td>
            <!-- Agrega más celdas según las propiedades que desees mostrar -->
          `;
            tablaDatos.appendChild(fila);
          });
        } else {
          // Mostrar el mensaje de error en la tabla
          const tablaDatos = document.getElementById("tablaDatos");
          tablaDatos.innerHTML = `<tr><td colspan="5">${data.data}</td></tr>`;
        }
      })
      .catch((error) => {
        console.error("Error al enviar la solicitud:", error);
        // Manejar el error, por ejemplo, mostrar un mensaje al usuario
      });
  } else {
    console.error("No se pudo obtener el valor de ID_Sesion del localStorage");
    // Manejar el caso en que no se pudo obtener el valor de ID_Sesion del localStorage
  }
});

//WEBSERVICE PARA CERRAR SESION

btncerrarSesion = document.getElementById("btncerrarSesion");

btncerrarSesion.addEventListener("click", () => {
  let IDSession = localStorage.getItem("ID_Session");

  if (IDSession) {
    fetch(
      "https://altis-ws.grupoagencia.com:444/JAgencia/JAgencia.asmx/wsLogOut",
      {
        method: "POST",
        body: JSON.stringify({ ID_Sesion: IDSession }), // Asegúrate de que el nombre del parámetro sea correcto
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        window.alert(`Has cerrado Sesion}`);
        localStorage.removeItem("ID_Session"); // Remover el ID de sesión del almacenamiento local
        console.log(data);
        window.location.href = "index.html";
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  } else {
    console.error("No se encontró el ID de sesión en el almacenamiento local");
  }
});
