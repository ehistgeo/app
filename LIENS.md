# Changer les liens de l'app

Mémo destiné à l'enseignant, pour la bascule de rentrée ou le remplacement
d'un lien en cours d'année. Aucune connaissance technique n'est nécessaire.

## L'essentiel en une phrase

Cinq tuiles sur dix pointent vers un raccourci `edurl.fr` que vous contrôlez :
**pour celles-là, il n'y a rien à modifier dans le code**, il suffit de
rediriger le raccourci depuis le raccourcisseur d'apps.education.fr. C'est
instantané, sans risque, et les élèves n'ont rien à faire.

## Les dix tuiles

| Tuile | Destination inscrite dans l'app | Nature | À la rentrée |
|---|---|---|---|
| 2GT | `edurl.fr/ON2GT` | raccourci | rediriger le raccourci |
| 1STMG | `edurl.fr/ON1STMG` | raccourci | rediriger le raccourci |
| 1SPE HGGSP | `edurl.fr/ON1HGGSP` | raccourci | rediriger le raccourci |
| TSPE HGGSP | `edurl.fr/ONTHGGSP` | raccourci | rediriger le raccourci |
| Casier | `edurl.fr/ehistgeo-depot` | raccourci | rediriger le raccourci |
| ENT | `psn.monlycee.net` | adresse directe | stable, rien à faire |
| LYCÉE | `cdg-longperrier.fr` | adresse directe | stable, rien à faire |
| Pearltrees | lien de partage privé Pearltrees | adresse directe | à changer si vous régénérez le lien |
| Réactiv' | `reactiv.dane.ac-versailles.fr` | adresse directe | stable, rien à faire |
| YouTube | playlist YouTube | adresse directe | à changer si vous changez de playlist |

La source de vérité reste le fichier `index.html`. Ce tableau décrit l'état
au 5 août 2026.

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

Si un carnet n'a pas encore de raccourci, créez-en un et prévenez-moi une
seule fois pour que je le câble dans l'app. Ensuite, il ne bougera plus.

## Méthode B, modifier l'app

Nécessaire seulement pour changer une adresse directe, un libellé, ou pour
brancher une nouvelle tuile.

1. Sur GitHub, ouvrez le dépôt `ehistgeo/app` et cliquez sur `index.html`.
2. Cliquez sur l'icône de crayon, « Edit this file ».
3. Cherchez la ligne de la tuile concernée. Chaque tuile tient sur une seule
   ligne et commence par `<a class="tile`. Le libellé visible par l'élève se
   trouve en fin de ligne, juste avant `</a>`.
4. Ne remplacez **que** ce qui se trouve entre les guillemets de `href="…"`.
   Ne touchez ni à `class`, ni à `target`, ni à `rel`, ni à `data-classe`.
5. En bas de page, décrivez la modification en une ligne, puis
   « Commit changes ».

Le site public se met à jour tout seul en une à deux minutes.

## Points de vigilance

**Toujours `https`**, jamais `http`, sauf pour le site du lycée dont le
certificat est invalide et qui impose `http`.

**Ne modifiez pas `sw.js`** pour un simple changement d'adresse. Le fichier
mis à jour parvient aux élèves à leur visite suivante, automatiquement. La
ligne `CACHE = 'ehistgeo-vN'` ne doit être incrémentée que si un fichier est
**ajouté, renommé ou supprimé**.

**Un élève déjà venu** peut voir l'ancienne version une fois de plus, puis la
nouvelle. C'est le prix du fonctionnement hors ligne, et cela se règle de
lui-même.

## Vérifier après une modification

Ouvrez <https://ehistgeo.github.io/app/>, appuyez sur la tuile modifiée et
vérifiez que la bonne page s'ouvre. Si l'ancienne apparaît encore, rechargez
une seconde fois.

## Les deux emplacements « ? »

Ce sont des cases en attente, volontairement non cliquables. Pour en activer
une, il faut à la fois un libellé et une adresse : donnez-moi les deux et je
les branche.
