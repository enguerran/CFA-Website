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

    // Icône "arrow-up-right-from-square" dupliquée depuis
    // src/_includes/icons.njk : ce fichier tourne en JS pur côté navigateur,
    // sans passer par Nunjucks, donc il ne peut pas réutiliser la table
    // ICONS du macro. Garder les deux synchronisées si cette icône change.
    var ARROW_ICON_SVG = '<svg viewBox="0 0 512 512" aria-hidden="true" focusable="false"><path fill="currentColor" d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l82.7 0-201.4 201.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3 448 192c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160c0-17.7-14.3-32-32-32L320 0zM80 96C35.8 96 0 131.8 0 176L0 432c0 44.2 35.8 80 80 80l256 0c44.2 0 80-35.8 80-80l0-80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 80c0 8.8-7.2 16-16 16L80 448c-8.8 0-16-7.2-16-16l0-256c0-8.8 7.2-16 16-16l80 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L80 96z"/></svg>';

    slot.innerHTML =
        '<a class="cfa-hero-announce-badge" href="' + url + '" target="_blank" rel="noopener noreferrer">' +
        '<span aria-hidden="true">' + ANNOUNCEMENT.emoji + '</span> ' +
        ANNOUNCEMENT.text + ' — ' + ANNOUNCEMENT.ctaText +
        ' <i class="fa-solid fa-arrow-up-right-from-square">' + ARROW_ICON_SVG + '</i></a>';
})();
