// Lógica principal de la aplicación

// Referencias a elementos DOM
const elementos = {
    form: document.getElementById('attendanceForm'),
    fecha: document.getElementById('fecha'),
    dni: document.getElementById('dni'),
    nombre: document.getElementById('nombre'),
    horaEntrada: document.getElementById('horaEntrada'),
    horaSalida: document.getElementById('horaSalida'),
    turno: document.getElementById('turno'),
    observaciones: document.getElementById('observaciones'),
    submitBtn: document.getElementById('submitBtn'),
    dniValidation: document.getElementById('dniValidation'),
    hoursInfo: document.getElementById('hoursInfo'),
    loading: document.getElementById('loading'),
    successMessage: document.getElementById('successMessage'),
    errorMessage: document.getElementById('errorMessage'),
    clock: document.getElementById('clock'),

};

// Actualizar reloj
function actualizarReloj() {
    elementos.clock.textContent = formatearFechaHora();
}


function actualizarCalculoHoras() {
    const calculo = calcularHoras(elementos.horaEntrada.value, elementos.horaSalida.value);
    if (elementos.hoursInfo) {
        mostrarElemento(elementos.hoursInfo, false);
    }
}


// Validar DNI
function validarDNI(dni) {
    if (dni.length === CONFIG.DNI_LENGTH) {
        const empleado = buscarEmpleado(dni);
        //console.log('empleado encontrado',empleado);
        //busca nombre del empleado en minuscula o MAYUSCULA
        if (empleado && (empleado.nombre ||empleado.NOMBRE)) {
            elementos.nombre.value = empleado.nombre || empleado.NOMBRE || '';
            elementos.nombre.readOnly = true;
            elementos.dniValidation.textContent = 'Empleado encontrado';
            elementos.dniValidation.className = 'validation-message success show';
            elementos.submitBtn.disabled = false;
        } else {
            elementos.nombre.value = '';
            elementos.nombre.readOnly = false;
            elementos.dniValidation.textContent = 'DNI no registrado - SOLICITAR REGISTRO';
            elementos.dniValidation.className = 'validation-message error show';
            elementos.submitBtn.disabled = true;
        }
    } else {
        elementos.dniValidation.classList.remove('show');
        elementos.nombre.value = '';
        elementos.nombre.readOnly = false;
        elementos.submitBtn.disabled = true;
    }
}

// Procesar envío del formulario
async function procesarFormulario(e) {
    e.preventDefault();
    
    // Validar horas
    if (!elementos.horaEntrada.value && !elementos.horaSalida.value) {
        mostrarMensaje(elementos.errorMessage, 'Ingrese hora de entrada y salida');
        return;
    }

    if (elementos.horaEntrada.value && elementos.horaSalida.value) {
    const resultado = calcularHoras(elementos.horaEntrada.value, elementos.horaSalida.value);
    const turnoSeleccionado = elementos.turno.value;

    // Turnos de 8 horas
    const turnos8Horas = ['06:00 - 15:00', '07:00 - 16:00', '09:00 - 18:00'];

    const turnosEspeciales=[
        '1er Día Descanso',
        '2do Día Descanso', 
        'Feriado'
    ]

    // Turnos de 7 horas
    const turnos7Horas = [
        '13:00 - 20:00',
        '14:00 - 21:00'
    ];
    
    // Turnos de 6 horas
    const turnos6Horas = [
        '17:00 - 23:00',
        '18:00 - 00:00',
        '00:00 - 06:00'
    ];

    let mininoHoras = 1;

    if (turnosEspeciales.includes(turnoSeleccionado)) {
        mininoHoras > 1;
    }else if (turnos8Horas.includes(turnoSeleccionado)) {
        mininoHoras = 8;
    } else if (turnos7Horas.includes(turnoSeleccionado)) {
        mininoHoras = 7;
    } else if (turnos6Horas.includes(turnoSeleccionado)) {
        mininoHoras = 6;
    }


    if (mininoHoras > 1 && resultado < mininoHoras) {
        mostrarMensaje(
            elementos.errorMessage, 
            `El turno ${turnoSeleccionado} requiere ${horasMinimas} horas. Registró ${totalHoras.toFixed(2)} horas`
        );
        return;
    }

    }
    


    // Mostrar loading
    elementos.loading.style.display = 'block';
    elementos.submitBtn.disabled = true;
    
    // Preparar datos
    const datos = {
        fecha: elementos.fecha.value,
        nombre: elementos.nombre.value,
        horaEntrada: elementos.horaEntrada.value,
        horaSalida: elementos.horaSalida.value,
        observaciones: elementos.observaciones.value,
        dni: elementos.dni.value,
        turno: elementos.turno.value
       
    };
    
    // Guardar
    const resultado = await guardarAsistencia(datos);
    
    // Ocultar loading
    elementos.loading.style.display = 'none';
    elementos.submitBtn.disabled = false;
    
    if (resultado.success) {
        mostrarMensaje(elementos.successMessage, 'Asistencia registrada correctamente');
        elementos.form.reset();
        elementos.fecha.value = obtenerFechaActual();
        elementos.dniValidation.classList.remove('show');
        // 3. Habilitar campo nombre
        elementos.nombre.readOnly = false;
        mostrarElemento(elementos.hoursInfo, false);
    } else {
        mostrarMensaje(elementos.errorMessage, 'Error al registrar asistencia');
    }
}

// Event Listeners
function inicializarEventos() {
    // DNI input
    elementos.dni.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        e.target.value = value;
        validarDNI(value);
    });
    
    // Actualizar cálculo de horas
    elementos.horaEntrada.addEventListener('change', actualizarCalculoHoras);
    elementos.horaSalida.addEventListener('change', actualizarCalculoHoras);
    
    // Submit form
    elementos.form.addEventListener('submit', procesarFormulario);
}

// Inicialización
async function inicializar() {

     // Configurar calendario restringido
    configCalendario();

    // Establecer fecha actual
    elementos.fecha.value = obtenerFechaActual();
    
    // Iniciar reloj
    actualizarReloj();
    setInterval(actualizarReloj, 1000);
    
    // Cargar empleados
    await cargarEmpleados();

    //llenar select Turnos
    const turnos = obtenerTurnos();
    llenarSelect(elementos.turno,turnos)
    
    // Configurar eventos
    inicializarEventos();
    
    console.log('Sistema iniciado');
}

// Iniciar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', inicializar);