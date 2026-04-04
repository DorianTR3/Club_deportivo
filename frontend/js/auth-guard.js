/**
 * js/auth-guard.js
 * Protección de rutas según los archivos en la carpeta /pages/
 */
function protegerPagina(rolesPermitidos) {
    const token = localStorage.getItem('token');
    const usuarioRaw = localStorage.getItem('usuario');

    // Si no hay sesión, mandarlo al login.html (que está en la misma carpeta /pages/)
    if (!token || !usuarioRaw) {
        window.location.href = 'login.html';
        return;
    }

    try {
        const usuario = JSON.parse(usuarioRaw);
        const rolUsuario = usuario.rol; 

        if (!rolesPermitidos.includes(rolUsuario)) {
            // Mapa de rutas ajustado a tus archivos reales
            const rutas = {
                'socio': 'homepage_socio.html',
                'instructor': 'homepage_instructor.html',
                'recepcion': 'homepage_recepcion.html',
                'coordinador': 'homepage_coordinador.html',
                'gerente': 'homepage_gerente.html', // Cambiado de 'admin' a 'gerente' según tu captura
                'admin': 'homepage_gerente.html' 
            };
            
            window.location.href = rutas[rolUsuario] || 'login.html';
        }
    } catch (e) {
        localStorage.clear();
        window.location.href = 'login.html';
    }
}