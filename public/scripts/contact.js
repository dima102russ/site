document.querySelector('#contact-form form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.querySelector('#contact-form input[name="name"]').value;
    const email = document.querySelector('#contact-form input[name="email"]').value;
    const message = document.querySelector('#contact-form textarea[name="message"]').value;

    const response = await fetch('/api/contacts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, message }),
    });

    if (response.ok) {
        alert('Ваше сообщение отправлено!');
        document.querySelector('#contact-form form').reset();
    } else {
        alert('Ошибка при отправке сообщения. Попробуйте позже.');
    }
});
