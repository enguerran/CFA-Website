// Bannière d'actualité du site.
// Texte générique : la page association HelloAsso liste automatiquement
// l'évènement actuellement ouvert aux réservations, donc rien à changer
// ici d'une édition à l'autre. Pour masquer la bannière (par exemple hors
// saison), passez enabled à false. L'URL vient de l'attribut
// data-helloasso-url du slot (rendu depuis site.json via le template),
// pour ne pas dupliquer cette donnée en dur dans le JS.
(function () {
    var ANNOUNCEMENT = {
        enabled: true,
        emoji: '🎉',
        text: 'Réservez votre place à notre prochain évènement',
        ctaText: 'Voir sur HelloAsso'
    };

    if (!ANNOUNCEMENT.enabled) return;

    var slot = document.getElementById('cfa-hero-announce');
    if (!slot) return;

    var url = slot.dataset.helloassoUrl;
    if (!url) return;

    slot.innerHTML =
        '<a class="cfa-hero-announce-badge" href="' + url + '" target="_blank" rel="noopener noreferrer">' +
        '<span aria-hidden="true">' + ANNOUNCEMENT.emoji + '</span> ' +
        ANNOUNCEMENT.text + ' — ' + ANNOUNCEMENT.ctaText +
        ' <i class="fa-solid fa-arrow-up-right-from-square"></i></a>';
})();
