// Bannière d'actualité du site.
// Texte et lien génériques : la page association HelloAsso liste
// automatiquement l'évènement actuellement ouvert aux réservations,
// donc rien à changer ici d'une édition à l'autre. Pour masquer la
// bannière (par exemple hors saison), passez enabled à false.
(function () {
    var ANNOUNCEMENT = {
        enabled: true,
        emoji: '🎉',
        text: 'Réservez votre place à notre prochain évènement',
        ctaText: 'Voir sur HelloAsso',
        url: 'https://www.helloasso.com/associations/comite-des-fetes-d-auzielle'
    };

    if (!ANNOUNCEMENT.enabled) return;

    var slot = document.getElementById('cfa-hero-announce');
    if (!slot) return;

    slot.innerHTML =
        '<a class="cfa-hero-announce-badge" href="' + ANNOUNCEMENT.url + '" target="_blank" rel="noopener noreferrer">' +
        '<span aria-hidden="true">' + ANNOUNCEMENT.emoji + '</span> ' +
        ANNOUNCEMENT.text + ' — ' + ANNOUNCEMENT.ctaText +
        ' <i class="fa-solid fa-arrow-up-right-from-square"></i></a>';
})();
