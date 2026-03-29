// Se obtienen las referencias a los elementos principales del formulario
const formularioSocio = document.getElementById('form-alta-socio');
const alertaExito = document.getElementById('alerta-exito');

// Se agrega el evento de escucha para el envio del formulario. 
// La funcion debe ser 'async' para poder usar 'await' internamente.
formularioSocio.addEventListener('submit', async (evento) => {
    // Se previene el comportamiento por defecto de recargar la pagina
    evento.preventDefault();
    
    // Extraccion de los datos ingresados por el usuario
    const datosSocio = Object.fromEntries(new FormData(formularioSocio));

    try {
        // Direccion absoluta hacia el entorno local de Node.js
        const respuesta = await fetch('http://localhost:3000/api/socios', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datosSocio)
        });

        // Se procesa la respuesta del servidor
        const resultado = await respuesta.json();

if (resultado.exito) {
            // 1. Extraemos el numero de socio desestructurando, tal como pide el ticket
            const { numero_socio } = resultado;
            
            // 2. Usamos la variable extraida para el mensaje exacto
            alertaExito.textContent = `Socio registrado correctamente. Número asignado: ${numero_socio}`;
            alertaExito.style.display = 'block';
            
            // Hacemos que la página suba suavemente para ver la alerta
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
            // 3. Temporizador de 3 segundos para limpiar todo
            setTimeout(() => {
                alertaExito.style.display = 'none';
                formularioSocio.reset();
            }, 5000);
        } else {
            // Notificacion de errores de validacion rechazados por el backend
            alert("Error al registrar socio: " + resultado.mensajes.join(', '));
        }
    } catch (error) {
        // Manejo de errores de red o servidor apagado
        console.error("Error de conexion:", error);
        alert("Asegurate de que el servidor Node.js este encendido.");
    }
});