(function () {
    const form = document.getElementById('contactForm');
    if (!form) return;

    const USER_ID = '5512K-AZX12fCBtPK';

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const name = formData.get('name');
        const email = formData.get('email');
        const message = formData.get('message');

        if (!name || !email || !message) {
            alert('Veuillez remplir tous les champs du formulaire.');
            return;
        }

        emailjs.send('service_ajykrdq', 'template_taaikfc', {
            from_name: formData.get('name'),
            to_name: 'CFA',
            from_email: formData.get('email'),
            to_email: '',
            message: formData.get('message')
        }, USER_ID)
            .then(() => {
                alert('Merci pour votre message. Je vous contacte très rapidement.');
            })
            .catch((error) => {
                console.error(error);
                alert("Quelque chose s'est mal passé.");
            });
    };

    form.addEventListener('submit', handleSubmit);
})();
