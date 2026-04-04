document.addEventListener('DOMContentLoaded', () => {
    cargarRoles();

    const formAltaUsuario = document.getElementById('registro-form');
    if (formAltaUsuario) {
        formAltaUsuario.addEventListener('submit', registrarUsuario);
    }
});

// PASO 1: CARGA DINÁMICA DE ROLES
async function cargarRoles() {
    const selectRol = document.getElementById('rol'); // Ajustado a tu ID
    
    try {
        const respuesta = await fetch('http://localhost:3000/api/roles');
        
        if (!respuesta.ok) throw new Error('Error al obtener los roles');

        const roles = await respuesta.json();

        selectRol.innerHTML = '<option value="">Selecciona un rol...</option>';

        roles.forEach(rol => {
            const option = document.createElement('option');
            option.value = rol.rol_id; 
            option.textContent = rol.nombre_rol; 
            selectRol.appendChild(option);
        });

    } catch (error) {
        console.error("Fallo al cargar roles:", error);
        mostrarError("No se pudieron cargar los roles desde el servidor.");
    }
}

// PASO 2 Y 3: ENVÍO DEL FORMULARIO Y MANEJO DE RESPUESTAS
async function registrarUsuario(e) {
    e.preventDefault(); 

    const btnSubmit = document.querySelector('.btn-registrar'); // Ajustado a tu clase
    
    document.getElementById('mensaje-exito').style.display = 'none';
    document.getElementById('mensaje-error').style.display = 'none';

    btnSubmit.disabled = true;
    btnSubmit.textContent = 'Registrando...';

    //nuevos campos para el form interno
    const nombres = document.getElementById('nombres').value.trim();
    const apellido_paterno = document.getElementById('apellidoPaterno').value.trim();
    const apellido_materno = document.getElementById('apellidoMaterno').value.trim();
    const curp = document.getElementById('curp').value.trim();
    const telefono = document.getElementById('telefono').value.trim();
    const fecha_nacimiento = document.getElementById('fecha_nacimiento').value;
    const genero = document.getElementById('genero').value;
    const direccion = document.getElementById('direccion').value.trim();
    const email = document.getElementById('correo').value.trim();
    const contrasena = document.getElementById('contrasena').value;
    const rol_id = document.getElementById('rol').value;

    // Agrega esta línea para capturar la especialidad (si existe)
    const inputEspecialidad = document.getElementById('especialidad');
    const especialidad = inputEspecialidad ? inputEspecialidad.value.trim() : null;

    const token = localStorage.getItem('token');

    try {
        const respuesta = await fetch('http://localhost:3000/api/usuarios-internos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify({ 
                        nombres, apellido_paterno, apellido_materno, curp, 
                        telefono, fecha_nacimiento, genero, direccion, 
                        email, contrasena, rol_id, especialidad 
                    })
            });

        const data = await respuesta.json();

        if (respuesta.status === 409) {
            mostrarError("El correo ingresado ya se encuentra registrado.");
            document.getElementById('correo').focus();
        } else if (!respuesta.ok) {
            mostrarError(data.error || "Ocurrió un error al registrar el usuario.");
        } else {
            mostrarExito("Usuario interno registrado correctamente.");
            document.getElementById('registro-form').reset(); 
        }

    } catch (error) {
        console.error("Error de red:", error);
        mostrarError("Fallo de conexión con el servidor.");
    } finally {
        btnSubmit.disabled = false;
        btnSubmit.textContent = 'Registrar Usuario';
    }
}

function mostrarError(texto) {
    const errorDiv = document.getElementById('mensaje-error');
    errorDiv.textContent = texto;
    errorDiv.style.display = 'block';
}

function mostrarExito(texto) {
    const exitoDiv = document.getElementById('mensaje-exito');
    exitoDiv.textContent = texto;
    exitoDiv.style.display = 'block';
}

document.getElementById('rol').addEventListener('change', function(e) {
    const divEspecialidad = document.getElementById('div-especialidad');
    // Si el texto del rol seleccionado dice 'instructor' (o como lo tengas en tu BD)
    if (e.target.options[e.target.selectedIndex].text.toLowerCase() === 'instructor') {
        divEspecialidad.style.display = 'block';
    } else {
        divEspecialidad.style.display = 'none';
        document.getElementById('especialidad').value = ''; // Limpiamos si se arrepiente
    }
});