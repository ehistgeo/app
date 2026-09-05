/* Adresse du service de comptage, la seule ligne à modifier pour l'activer.
 *
 * Tant que cette valeur est vide, le comptage est entièrement inactif :
 * l'app n'envoie rien, n'écrit aucune donnée supplémentaire sur l'appareil de
 * l'élève, et ne fait aucune requête vers un tiers. Le tableau de bord
 * affiche alors la marche à suivre.
 *
 * Une fois le service déployé, remplacez la chaîne vide par l'adresse relevée
 * chez Cloudflare, sans barre oblique finale, par exemple :
 *   window.EHG_COMPTEUR = 'https://ehistgeo-compteur.exemple.workers.dev';
 *
 * Voir compteur/README.md pour le déploiement.
 */
window.EHG_COMPTEUR = '';
