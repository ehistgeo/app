# Modifier l'app

Mémo destiné à l'enseignant, pour la bascule de rentrée ou le remplacement
d'un lien en cours d'année. Aucune connaissance technique n'est nécessaire.

État au 8 septembre 2026. La source de vérité reste `index.html` ; ce document le
décrit, il ne le remplace pas.

## L'essentiel en une phrase

Cinq destinations passent par un raccourci `edurl.fr` que vous contrôlez :
**pour celles-là, il n'y a rien à modifier dans le code**, il suffit de
rediriger le raccourci depuis le raccourcisseur d'apps.education.fr. C'est
instantané, sans risque, et les élèves n'ont rien à faire.

## Vérifier l'app sans ouvrir le code

<https://ehistgeo.github.io/app/apercu.html>

Cette page, réservée à votre usage, montre l'app telle que la voit chaque
classe, la liste complète des destinations avec leur adresse, et ce que l'app
a retenu sur votre appareil. C'est le moyen le plus rapide de contrôler une
modification.

## Les tuiles, et qui les voit

Le bloc « Vos outils et ressources » s'adapte à la classe que l'élève a
touchée au moins une fois.

| Tuile | Destination | Nature | Vue par |
|---|---|---|---|
| 2GT6 | `edurl.fr/ON2GT` | raccourci | tous |
| 1STMG4 | `edurl.fr/ON1STMG` | raccourci | tous |
| 1SPE HGGSP2 | `edurl.fr/ON1HGGSP` | raccourci | tous |
| TSPE HGGSP2 | `edurl.fr/ONTHGGSP` | raccourci | tous |
| ENT | `psn.monlycee.net` | adresse directe | tous |
| LYCÉE | `cdg-longperrier.fr` | adresse directe, en `http` | tous |
| Pearltrees | lien de partage Pearltrees | adresse directe | tous |
| Réactiv' | `reactiv.dane.ac-versailles.fr/reactiv/app/` | adresse directe | tous |
| IA | `duck.ai` | adresse directe | tous |
| Casier | `edurl.fr/ehistgeo-casier` | raccourci | tous |
| Orientation | menu de 3 liens | menu | 2GT6 seulement |
| Choisir l'HGGSP | menu de 5 liens | menu | 2GT6 seulement |
| Bac HGGSP | menu de 3 liens | menu | 1SPE et TSPE HGGSP2 |
| Grand oral | `education.gouv.fr` | adresse directe | 1SPE et TSPE HGGSP2 |
| YouTube | votre playlist | adresse directe | tous |
| S'informer | menu de 6 quotidiens | menu | tous |
| Se cultiver | menu de 7 chaînes | menu | tous |

**1STMG4 ne voit ni les tuiles d'orientation, ni celles de spécialité.**

## Méthode A, sans toucher au code

Pour les cinq raccourcis, chaque année :

1. ouvrez le raccourcisseur d'apps.education.fr et connectez-vous ;
2. retrouvez le raccourci concerné, par exemple `ON2GT` ;
3. remplacez son adresse de destination par celle du nouveau carnet OneNote ;
4. enregistrez.

L'app est aussitôt à jour, sans déploiement et sans que vous ayez ouvert le
dépôt. **C'est la méthode à privilégier.** Conservez les mêmes noms de
raccourcis d'une année sur l'autre, c'est précisément ce qui vous évite
d'avoir à modifier l'app.

## Méthode B, modifier l'app

Nécessaire pour changer une adresse directe, un libellé, ou une entrée de menu.

1. Sur GitHub, ouvrez le dépôt `ehistgeo/app` et cliquez sur `index.html`.
2. Cliquez sur l'icône de crayon, « Edit this file ».
3. Repérez la ligne concernée. Chaque tuile et chaque entrée de menu tient sur
   une seule ligne. Le libellé visible se trouve en fin de ligne, juste avant
   `</a>` ou `</label>`.
4. Ne remplacez **que** ce qui se trouve entre les guillemets de `href="…"`.
   Ne touchez ni à `class`, ni à `target`, ni à `rel`, ni à `data-classe`.
5. En bas de page, décrivez la modification en une ligne, puis
   « Commit changes ».

Le site public se met à jour tout seul en une à deux minutes.

## Ajouter ou retirer une entrée dans un menu

Les entrées d'un menu sont regroupées dans un bloc `<div class="menu__liste">`
portant un identifiant, par exemple `id="liste-informer"` pour « S'informer ».
Pour ajouter une entrée, recopiez une ligne voisine et changez l'adresse et le
libellé. Pour en retirer une, supprimez sa ligne entière.

Les menus s'affichent sur deux colonnes : un nombre pair d'entrées est plus
équilibré, sans que ce soit une obligation.

## Ce qu'il ne faut pas modifier

**`sw.js`**, pour un simple changement d'adresse. Le fichier mis à jour
parvient aux élèves à leur visite suivante, automatiquement. La ligne
`CACHE = 'ehistgeo-vN'` ne doit être incrémentée que si un fichier est
**ajouté, renommé ou supprimé**.

**Les attributs `class` et `data-classe`.** Les classes `tile--r2`, `tile--r3`
et `tile--r4` portent le dégradé de couleur, `pour-seconde` et `pour-spe`
déterminent qui voit la tuile, `data-classe` relie une tuile de cours au
mécanisme de niveau et aux raccourcis d'application.

**`manifest.json`**, sauf pour renommer une classe : les quatre raccourcis
d'application y reprennent les noms de classe, qui doivent rester identiques à
ceux des attributs `data-classe`.

## Points de vigilance

**Toujours `https`**, jamais `http`, sauf pour le site du lycée dont le
certificat est invalide et qui impose `http`.

**Un élève déjà venu** peut voir l'ancienne version une fois de plus, puis la
nouvelle. C'est le prix du fonctionnement hors ligne, et cela se règle de
lui-même.

**Un raccourci mort ne se signale pas.** Quand un lien `edurl.fr` cesse
d'exister, le raccourcisseur répond normalement et affiche sa propre page
« lien invalide » : rien ne distingue cette réponse d'un lien qui marche, sinon
la page où l'on aboutit. Ne vous fiez donc pas au fait que « ça répond »,
regardez où vous arrivez.

**Certains liens échappent à toute vérification automatique.** Les serveurs de
`education.gouv.fr`, de `parcoursup.gouv.fr` et parfois de `liberation.fr`
refusent les contrôles automatisés. Cliquez-les vous-même après une
modification.

## Vérifier après une modification

Ouvrez la page d'aperçu, ou l'app elle-même, appuyez sur la tuile modifiée et
vérifiez que la bonne page s'ouvre. Si l'ancienne apparaît encore, rechargez
une seconde fois.
