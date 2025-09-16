// Funciones utilitarias

// Formatear fecha actual
function obtenerFechaActual() {
    return new Date().toISOString().split('T')[0];
}

// Formatear fecha y hora para reloj
function formatearFechaHora() {
    return new Date().toLocaleString('es-HN');
}

// Formatear minutos a texto legible
function formatearTiempo(minutos) {
    const h = Math.floor(minutos / 60);
    const m = Math.round(minutos % 60);
    return `${h}h ${m}m`;
}

// Calcular horas trabajadas
function calcularHoras(entrada, salida) {
    if (!entrada || !salida) return null;

    const parseHora = h => {
        const [HH, MM] = h.split(':').map(Number);
        return (isNaN(HH) || isNaN(MM)) ? null : HH * 60 + MM;
    };

    let entradaMin = parseHora(entrada);
    let salidaMin  = parseHora(salida);
    if (entradaMin === null || salidaMin === null) return null;

    // Si la salida es menor o igual que la entrada → asumimos que es al día siguiente
    if (salidaMin <= entradaMin) salidaMin += 24 * 60;

    const totalMin = salidaMin - entradaMin;
    const totalHoras = totalMin / 60;

    return  totalHoras;

}

// Mostrar/ocultar elemento
function mostrarElemento(elemento, mostrar = true) {
    if (!elemento) return; 
    if (mostrar) {
        elemento.classList.add('show');
    } else {
        elemento.classList.remove('show');
    }
}

// Mostrar mensaje temporal
function mostrarMensaje(elemento, texto, duracion = 5000) {
    elemento.textContent = texto;
    mostrarElemento(elemento, true);
    
    setTimeout(() => {
        mostrarElemento(elemento, false);
    }, duracion);
}


// Turnos
function obtenerTurnos(){
    return [
        { value: '', texto: 'Seleccionar turno...' },
        { value: '06:00 - 15:00', texto: '06:00 - 15:00' },
        { value: '07:00 - 16:00', texto: '07:00 - 16:00' },
        { value: '09:00 - 18:00', texto: '09:00 - 18:00' },
        { value: '13:00 - 20:00', texto: '13:00 - 20:00' },
        { value: '14:00 - 21:00', texto: '14:00 - 21:00' },
        { value: '17:00 - 23:00', texto: '17:00 - 23:00' },
        { value: '18:00 - 00:00', texto: '18:00 - 00:00' },
        { value: '00:00 - 06:00', texto: '00:00 - 06:00' },
        { value: '1er Día Descanso', texto: '1er Día Descanso' },
        { value: '2do Día Descanso', texto: '2do Día Descanso' },
        { value: 'Feriado', texto: 'Feriado' }
    ];
}


// Llenar select
function llenarSelect(selectElement, opciones){

    if (!selectElement) return;
    selectElement.innerHTML = '';

    opciones.forEach(opcion => {
        const option = document.createElement('option');
        option.value = opcion.value;
        option.textContent = opcion.texto;
        selectElement.appendChild(option);
    });
}

function configCalendario() {
    const hoy = new Date;
    const _20diasAnt = new Date(hoy);
    _20diasAnt.setDate(hoy.getDate()-20)
    
    const min = _20diasAnt.toISOString().split('T')[0];
    const max = hoy.toISOString().split('T')[0];
    
    elementos.fecha.min = min;
    elementos.fecha.max = max;
    elementos.fecha.value = obtenerFechaActual();
}
