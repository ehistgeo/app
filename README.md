# e-histgeo

Application web installable qui donne aux élèves de M. PLANCHOT-GEFFARD un
portail unique vers les ressources du cours d'histoire-géographie, d'HGGSP et
d'EMC au lycée.

<https://ehistgeo.github.io/app/>

## Ce qu'elle fait

Un écran, sans défilement sur la plupart des téléphones. Quatre tuiles de
cours, puis un bloc d'outils et de ressources dont cinq tuiles déplient un
menu de liens.

- **S'adapte à la classe.** Une fois que l'élève a touché sa classe, l'app ne
  lui montre plus que les ressources qui le concernent.
- **Fonctionne hors ligne**, une fois ouverte une première fois.
- **S'installe** sur l'écran d'accueil, avec un raccourci par classe accessible
  d'un appui long sur l'icône.
- **Mode clair et sombre**, automatique ou au choix de l'élève.
- **Accessible au clavier**, contrastes conformes, cibles tactiles de 24 px
  minimum.
- **Ne collecte rien.** Aucune requête vers un tiers, aucun cookie, aucune
  mesure d'audience. Cinq informations sont retenues sur l'appareil de l'élève
  et n'en sortent jamais.

## Les fichiers

| Fichier | Rôle |
|---|---|
| `index.html` | l'app, et la seule source de vérité des liens |
| `styles.css` | mise en page, palette, mode sombre |
| `app.js` | classe retenue, thème, menus, message d'accueil, raccourcis |
| `sw.js` | service worker, fonctionnement hors ligne |
| `manifest.json` | installation, icônes, raccourcis d'application |
| `mentions.html` | mentions légales |
| `apercu.html` | page de service pour l'enseignant, non liée depuis l'app |
| `LIENS.md` | comment modifier un lien, sans connaissance technique |
| `source/` | le logo d'origine, hors du chemin servi |

## Modifier quelque chose

Voir [LIENS.md](LIENS.md). Dans la plupart des cas, il n'y a pas de code à
toucher : il suffit de rediriger un raccourci `edurl.fr`.
