# Déployer le compteur

Marche à suivre, environ vingt minutes, sans rien installer sur votre
ordinateur et sans ligne de commande. Tout se fait depuis le site de
Cloudflare.

Le plan gratuit suffit très largement et ne demande pas de carte bancaire.
Pour vos quatre classes, vous utiliserez environ 120 écritures par jour sur
un plafond de 1 000, et 300 lectures à chaque ouverture du tableau de bord
sur un plafond de 100 000 par jour.

## 1. Créer le compte

Rendez-vous sur <https://dash.cloudflare.com/sign-up>, créez un compte avec
votre adresse, confirmez le courriel. Ne choisissez aucune offre payante,
aucune n'est nécessaire.

## 2. Créer la base

Dans le menu de gauche, **Storage & Databases**, puis **KV**.

1. **Create instance**, ou **Create a namespace** selon la formulation ;
2. nommez-la `ehistgeo-jours` ;
3. validez.

C'est cette base qui contiendra les compteurs, et rien d'autre.

## 3. Créer le service

Dans le menu de gauche, **Compute (Workers)**, puis **Workers & Pages**.

1. **Create**, puis **Start with Hello World!**, puis **Get started** ;
2. nommez le service `ehistgeo-compteur` ;
3. **Deploy**. Le service est créé avec un code d'exemple, que nous allons
   remplacer.

## 4. Poser le code

1. Sur la page du service, **Edit code**, ou **</> Edit code** ;
2. dans l'éditeur, sélectionnez tout le code affiché et supprimez-le ;
3. ouvrez le fichier [`worker.js`](worker.js) de ce dossier, copiez tout son
   contenu, collez-le dans l'éditeur ;
4. **Deploy**, puis confirmez.

## 5. Relier le service à la base

C'est l'étape que l'on oublie, et sans laquelle rien ne fonctionne.

1. Sur la page du service, onglet **Settings**, section **Bindings** ;
2. **Add**, puis **KV namespace** ;
3. **Variable name** : tapez exactement `COMPTEUR`, en majuscules ;
4. **KV namespace** : choisissez `ehistgeo-jours` ;
5. **Deploy**.

## 6. Relever l'adresse et me la donner

Sur la page du service, l'adresse est affichée sous la forme :

```
https://ehistgeo-compteur.VOTRE-SOUS-DOMAINE.workers.dev
```

Envoyez-la-moi. Je la poserai dans l'app, et le tableau de bord s'allumera.

Tant que cette adresse n'est pas renseignée, **le comptage est inactif** :
l'app n'envoie rien, ne stocke rien de plus, et se comporte exactement comme
aujourd'hui.

## Vérifier que cela fonctionne

Une fois l'adresse posée, ouvrez l'app puis, dans votre navigateur, cette
adresse :

```
https://ehistgeo-compteur.VOTRE-SOUS-DOMAINE.workers.dev/jours?n=7
```

Vous devez voir apparaître quelque chose comme
`{"2026-09-14":0,"2026-09-15":1}`. Si vous voyez `1` pour aujourd'hui, la
chaîne est complète.

## Ce que la base contient, et rien d'autre

```
j:2026-09-15:0 → 14
j:2026-09-15:1 → 11
j:2026-09-15:2 → 9
...
```

Une date, un numéro de tranche, un nombre. Aucune adresse IP n'est
enregistrée, aucun identifiant d'appareil, aucune classe, aucune heure.
Les compteurs s'effacent d'eux-mêmes au bout d'un an.

## Ce que le chiffre veut dire

Le nombre d'**appareils distincts** ayant ouvert l'app dans la journée, et non
le nombre d'ouvertures : l'app ne signale sa présence qu'une fois par jour et
par appareil. Un élève qui ouvre l'app cinq fois compte pour un. Un élève qui
l'ouvre sur son téléphone et sur l'ordinateur du CDI compte pour deux.

Deux limites à garder en tête. Un élève **hors ligne** n'est pas compté, le
signal ne pouvant pas partir ; c'est la contrepartie du fonctionnement hors
connexion. Et un élève qui efface les données de son navigateur sera compté
une fois de plus le jour même.
