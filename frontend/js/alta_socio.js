const formularioSocio = document.getElementById('form-alta-socio');
const alertaExito = document.getElementById('alerta-exito');

formularioSocio.addEventListener('submit', async (evento) => {
    evento.preventDefault();
    
    const token = localStorage.getItem("token");

    // Sacamos los datos a la antigüita, con mucho más control y evitando nulos mortales
    // OJO: Le ponemos 'nombres' en plural y 'email' para que cuadre con tu backend
    const nombres = document.getElementById('nombre').value.trim();
    const apellido_paterno = document.getElementById('apellido_paterno').value.trim();
    const apellido_materno = document.getElementById('apellido_materno').value.trim() || null;
    const curp = document.getElementById('curp').value.trim();
    
    const fecha_nacimiento = document.getElementById('fecha_nacimiento').value || null;
    
    // Para los selects, nos aseguramos de que existan antes de sacar el valor
    const selectGenero = document.getElementById('genero');
    const genero = selectGenero ? selectGenero.value : null;
    
    const selectTipoSocio = document.getElementById('tipo_socio');
    const tipo_socio = selectTipoSocio ? selectTipoSocio.value : null;
    
    const selectModalidad = document.getElementById('modalidad');
    const modalidad = selectModalidad ? selectModalidad.value : null;

    const telefono = document.getElementById('telefono').value.trim() || null;
    const email = document.getElementById('email_contacto').value.trim(); 
    const direccion = document.getElementById('direccion').value.trim() || null;
    
    const nombre_emergencia = document.getElementById('nombre_emergencia').value.trim() || null;
    const tel_emergencia = document.getElementById('tel_emergencia').value.trim() || null;
    
    // Tu campo nuevo de contraseña
    const contrasena = document.getElementById('contrasena').value.trim();

    // Armamos el objeto exacto que se va al servidor
    const datosSocio = {
        nombres, 
        apellido_paterno,
        apellido_materno,
        curp,
        fecha_nacimiento,
        genero,
        tipo_socio,
        modalidad,
        telefono,
        email, 
        direccion,
        nombre_emergencia,
        tel_emergencia,
        contrasena
    };

    console.log("Datos que viajan al back:", datosSocio);

    try {
        const respuesta = await fetch('http://localhost:3000/api/socios', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify(datosSocio)
        });

        const resultado = await respuesta.json();

        // Validamos si el backend regresó un status exitoso (200 o 201)
        if (respuesta.ok || resultado.exito) {
            const numeroSocio = resultado.numero_socio || "Asignado";
            
            alertaExito.textContent = `Socio registrado correctamente. Número: ${numeroSocio}`;
            alertaExito.style.display = 'block';
            
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
            setTimeout(() => {
                alertaExito.style.display = 'none';
                formularioSocio.reset();
            }, 5000);

        } else {
            let textoError = "Ocurrio un error al registrar";
            if (resultado.errores) {
                textoError = resultado.errores.join(', ');
            } else if (resultado.error) {
                textoError = resultado.error;
            } else if (resultado.mensaje) {
                textoError = resultado.mensaje;
            }
            alert("Error al registrar socio: " + textoError);
        }
    } 
    catch (error) {
        console.error("Error de conexion:", error);
        alert("Asegurate de que el servidor Node.js este encendido.");
    } finally {
        // Restauramos el botón por si se queda trabado
        const btnSubmit = document.querySelector('.btn-registrar');
        if (btnSubmit) {
            btnSubmit.disabled = false;
        }
    }
});