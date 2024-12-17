document.getElementById('registroForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const usuario = document.getElementById('nuevoUsuario').value;
    const contrasena = document.getElementById('nuevaContrasena').value;
    const confirmarContrasena = document.getElementById('confirmarContrasena').value;
    const mensajeDiv = document.getElementById('mensaje');

    // Limpiar mensaje anterior
    mensajeDiv.textContent = '';
    mensajeDiv.classList.remove('error', 'exito');

    // Validaciones
    if (contrasena !== confirmarContrasena) {
        mensajeDiv.textContent = 'Las contraseñas no coinciden';
        mensajeDiv.classList.add('error');
        return;
    }

    try {
        const response = await fetch('https://tu-backend-deployment.com/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: usuario,
                password: contrasena
            })
        });

        const result = await response.text();
        if (response.ok) {
            mensajeDiv.textContent = 'Registro exitoso';
            mensajeDiv.classList.add('exito');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);
        } else {
            mensajeDiv.textContent = result;
            mensajeDiv.classList.add('error');
        }
    } catch (error) {
        mensajeDiv.textContent = 'Error en el registro';
        mensajeDiv.classList.add('error');
        console.error('Error:', error);
    }
});