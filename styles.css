function mostrarSeccion(seccion) {
    document.getElementById('jugar').style.display = 'none';
    document.getElementById('noticias').style.display = 'none';
    document.getElementById('skins').style.display = 'none';
    document.getElementById(seccion).style.display = 'block';
}

function iniciarJuego() {
    let barra = document.getElementById('barra-carga');
    let progreso = document.getElementById('progreso');
    let seleccion = document.getElementById('versiones').value;
    
    barra.style.display = 'block';
    progreso.style.width = '0%';

    let carga = 0;
    let intervalo = setInterval(() => {
        carga += 10;
        progreso.style.width = carga + '%';

        if (carga >= 100) {
            clearInterval(intervalo);
            setTimeout(() => {
                window.location.href = seleccion;
            }, 500);
        }
    }, 300);
}
