# Événements en fichiers Markdown individuels, pas un JSON unique

La décision initiale (voir `CONTEXT.md`) était "un seul fichier `events.json` pour tous les événements, plus simple qu'un fichier par événement". On revient dessus : chaque événement vit maintenant dans son propre fichier `src/events/<slug>.md`, avec frontmatter pour les champs structurés (`title`, `image`, `tagline`, `helloasso`, `order`) et le corps en Markdown pour la description.

**Pourquoi ce changement :** l'utilisateur voulait éditer la prose des événements en Markdown plutôt qu'en chaîne JSON avec `\n` échappés. Markdown ne s'intègre naturellement qu'à l'échelle du fichier (frontmatter + corps), pas à l'intérieur d'un champ de tableau JSON. Le slug de chaque événement est dérivé automatiquement du nom de fichier (`page.fileSlug`) via une collection Eleventy triée sur le champ `order`, ce qui élimine au passage la duplication d'URL entre `event.njk` et `index.njk` documentée dans l'issue #15 (l'URL vient maintenant d'une source unique : `eventPage.url`).

`partners.json` reste un tableau JSON unique (décision non remise en cause) : les partenaires n'ont pas de prose longue à éditer, juste des champs courts.
