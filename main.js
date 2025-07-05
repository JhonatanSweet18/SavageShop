
document.getElementById('order-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);

    try {
        const response = await fetch('/submit-order', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            alert('¡Pedido enviado con éxito!');
            form.reset();
        } else {
            alert('Error al enviar el pedido. Por favor, inténtalo de nuevo.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error de conexión. Por favor, revisa tu conexión a internet.');
    }
});
