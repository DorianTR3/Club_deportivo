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
            // Solo inyectamos el texto y le decimos que se muestre
            alertaExito.textContent = `Socio registrado correctamente. Número asignado: ${resultado.numero_socio}`;
            alertaExito.style.display = 'block';

            // Ya no necesitamos poner colores aquí, porque de eso se encarga tu CSS

            setTimeout(() => {
                alertaExito.style.display = 'none';
                formularioSocio.reset();
            }, 3000);
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