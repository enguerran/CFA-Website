# Formulaire de contact : mailto: préempli, pas de service tiers

Le formulaire de contact de la page d'accueil envoyait ses messages via EmailJS, un service cloud tiers nécessitant un SDK JavaScript chargé depuis un CDN. On revient dessus : le formulaire ne fait plus qu'assembler un lien `mailto:` préempli (destinataire, sujet, corps) à partir des champs saisis, et laisse le client mail de la personne (natif ou webmail) prendre le relais pour l'envoi effectif.

**Pourquoi ce changement :** `CONTEXT.md` liste depuis le début "Zéro dépendance externe (pas de service cloud)" comme contrainte du projet — EmailJS y contrevenait directement. Le CFA reçoit peu de messages par ce formulaire ; l'utilisateur a explicitement accepté de sacrifier l'engagement (confirmation d'envoi in-page, pas de dépendance à un client mail configuré) contre la suppression complète de la dépendance externe. Un lien `mailto:` simple existe déjà ailleurs sur la page d'accueil (bloc de contact du hero) ; le formulaire reste utile car il structure la saisie (nom, email, message) et prépare un sujet/corps cohérents, ce qu'un lien `mailto:` nu ne fait pas.

**Limites acceptées :**
- Aucune confirmation que le message a effectivement été envoyé (le site ne peut pas savoir si un client mail est configuré, ni si l'utilisateur a validé l'envoi une fois son client ouvert).
- Comportement variable selon l'appareil/navigateur (certains contextes mobiles n'ont pas de client mail par défaut configuré).
- Longueur du message limitée par les contraintes d'URL `mailto:` de certains clients (non problématique pour l'usage actuel : messages courts, faible volume).

**Implémentation :** `src/pages/index.njk` passe l'adresse de contact au formulaire via `data-contact-email="{{ site.email }}"` (même convention que `data-helloasso-url` pour le bandeau d'annonce). `src/assets/contact.js` construit `mailto:{email}?subject=...&body=...` (avec `encodeURIComponent`) et navigue vers ce lien au submit, au lieu d'appeler un SDK d'envoi. Aucun script tiers chargé pour le formulaire.
