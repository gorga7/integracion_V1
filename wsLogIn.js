let btnEnviar = document.getElementById("Enviar");
let Respuesta = document.getElementById("Respuesta");

btnEnviar.addEventListener("click", async function () {
  const login = document.getElementById("Login").value;
  const Contrasenia = document.getElementById("Contrasenia").value;

  // Verificar si los campos de login y contraseña no están vacíos
  if (login.trim() === "" || Contrasenia.trim() === "") {
    alert("Por favor, ingrese el usuario y la contraseña.");
    return;
  }

  const url =
    "https://altis-ws.grupoagencia.com:444/JAgenciaQA/JAgencia.asmx/wsLogin";
  const data = {
    Login: login,
    Contrasenia: Contrasenia,
  };

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    mode: "cors",
    body: JSON.stringify(data),
  };

  try {
    const response = await fetch(url, requestOptions);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const responseData = await response.json();

    // Verificar si la propiedad 'result' es 1 (error)
    if (responseData.result === 1) {
      console.log("Error:", responseData.data);
      alert("Usuario y/o contraseña incorrecto");
    } else {
      alert("Logueado correctamente");
      console.log(responseData);
      localStorage.setItem("ID_Session", responseData.data[0].ID_Session);
      localStorage.setItem("Nombre", responseData.data[0].D_Cliente)
      window.location.href = "/public/html/inicio.html";
    }
  } catch (error) {
    // Manejar errores de red y otros errores
    console.error("Error:", error.message);
    document.getElementById("Respuesta").innerText = "Error desconocido";
  }
});
