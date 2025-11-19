// Función para abrir la versión seleccionada
function openClient(clientFile) {
    window.location.href = clientFile;
}

// Manejar la sugerencia
document.getElementById('suggestion-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const suggestion = document.getElementById('suggestion-input').value;

    // Validar que se haya escrito algo
    if (suggestion.trim() === "") {
        alert("Por favor, escribe una sugerencia.");
        return;
    }

    // Configura tu Webhook de Discord aquí
    const webhookUrl = "TU_DISCORD_WEBHOOK_URL"; // Reemplaza con tu URL real

    const payload = {
        content: `Nueva sugerencia recibida: ${suggestion}`,
        username: "Sugerencias del Launcher"
    };

    fetch(webhookUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    })
    .then(response => {
        if (response.ok) {
            alert("¡Gracias por tu sugerencia!");
            document.getElementById('suggestion-input').value = ""; // Limpiar el campo
        } else {
            alert("Hubo un problema al enviar tu sugerencia. Intenta más tarde.");
        }
    })
    .catch(error => {
        alert("Hubo un error al intentar enviar la sugerencia.");
        console.error(error);
    });
});
