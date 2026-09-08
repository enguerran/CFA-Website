(function () {
    const form = document.getElementById('contactForm');
    if (!form) return;

    // Pas de service d'envoi tiers (voir ADR-0002) : le formulaire ne fait
    // que préremplir un lien mailto: avec les infos saisies, puis laisse le
    // client mail habituel de la personne prendre le relais. L'adresse vient
    // de site.json via data-contact-email, pour ne pas la dupliquer en dur ici.
    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const name = (formData.get('name') || '').trim();
        const email = (formData.get('email') || '').trim();
        const message = (formData.get('message') || '').trim();

        if (!name || !email || !message) {
            alert('Veuillez remplir tous les champs du formulaire.');
            return;
        }

        const contactEmail = form.dataset.contactEmail;
        const subject = 'Message de ' + name + ' via le site';
        const body = 'Nom : ' + name + '\n' +
            'Email : ' + email + '\n\n' +
            message;

        window.location.href = 'mailto:' + contactEmail +
            '?subject=' + encodeURIComponent(subject) +
            '&body=' + encodeURIComponent(body);
    };

    form.addEventListener('submit', handleSubmit);
})();
