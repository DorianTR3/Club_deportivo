const formularioSocio = document.getElementById('form-alta-socio');
const alertaExito = document.getElementById('alerta-exito');

formularioSocio.addEventListener('submit', async (evento) => {
    evento.preventDefault();
    
    const formData = new FormData(formularioSocio);

    const datosSocio = {
        nombre: formData.get("nombre"),
        apellido: formData.get("apellido"),
        curp: formData.get("curp"),
        tipo_socio: formData.get("tipo_socio"),
        modalidad: formData.get("modalidad"),
        fecha_nacimiento: formData.get("fecha_nacimiento"),
        genero: formData.get("genero"),
        direccion: formData.get("direccion"),
        telefono: formData.get("telefono"),
        email_contacto: formData.get("email_contacto")
    };

    try {
        const respuesta = await fetch('http://localhost:3000/api/socios', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
                // 'Authorization': `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify(datosSocio)
        });

        const resultado = await respuesta.json();

        if (resultado.exito) {
            const { numero_socio } = resultado;
            
            alertaExito.textContent = `Socio registrado correctamente. Número asignado: ${numero_socio}`;
            alertaExito.style.display = 'block';
            
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
            setTimeout(() => {
                alertaExito.style.display = 'none';
                formularioSocio.reset();
            }, 5000);

        } else {
            alert("Error al registrar socio: " + resultado.mensajes.join(', '));
        }

    } catch (error) {
        console.error("Error de conexion:", error);
        alert("Asegurate de que el servidor Node.js este encendido.");
    }
});