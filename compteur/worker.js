/* Compteur de fréquentation de l'app e-histgeo.
 *
 * Ce service ne conserve qu'un entier par jour et par tranche. Il n'enregistre
 * ni adresse IP, ni identifiant, ni session, ni classe, ni la moindre trace
 * permettant de reconnaître un appareil. Une visite arrive, un compteur monte
 * de un, et rien d'autre n'est écrit.
 *
 * Deux précautions expliquent la forme du code.
 *
 * La base KV de Cloudflare n'accepte qu'une écriture par seconde sur une même
 * clé, et l'opération « lire puis écrire » n'y est pas atomique. Un compteur
 * unique par jour perdrait donc des visites à chaque intercours, quand trente
 * élèves ouvrent l'app en même temps. Le compteur est réparti sur dix clés
 * tirées au hasard : la limite devient dix écritures par seconde et les
 * collisions deviennent négligeables. La lecture additionne les dix tranches.
 *
 * La journée est calculée à l'heure de Paris et non en temps universel, sans
 * quoi les ouvertures entre minuit et deux heures seraient portées au compte
 * de la veille.
 *
 * Déploiement : voir README.md dans ce dossier.
 */

const ORIGINE = 'https://ehistgeo.github.io';
const TRANCHES = 10;
const JOURS_MAX = 180;
const RETENTION = 60 * 60 * 24 * 400; // les compteurs s'effacent seuls au bout d'un an

function entetes(extra) {
  const e = {
    'Access-Control-Allow-Origin': ORIGINE,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Max-Age': '86400',
    'Cache-Control': 'no-store'
  };
  return Object.assign(e, extra || {});
}

/* AAAA-MM-JJ à l'heure de Paris, décalage j jours en arrière. */
function jour(decalage) {
  const d = new Date(Date.now() - (decalage || 0) * 86400000);
  return new Intl.DateTimeFormat('fr-CA', {
    timeZone: 'Europe/Paris', year: 'numeric', month: '2-digit', day: '2-digit'
  }).format(d);
}

async function signaler(env) {
  const cle = 'j:' + jour(0) + ':' + Math.floor(Math.random() * TRANCHES);
  const actuel = parseInt((await env.COMPTEUR.get(cle)) || '0', 10);
  await env.COMPTEUR.put(cle, String(actuel + 1), { expirationTtl: RETENTION });
  return new Response(null, { status: 204, headers: entetes() });
}

async function jours(env, url) {
  let n = parseInt(url.searchParams.get('n') || '30', 10);
  if (!(n > 0)) n = 30;
  if (n > JOURS_MAX) n = JOURS_MAX;

  const dates = [];
  for (let i = n - 1; i >= 0; i--) dates.push(jour(i));

  /* n x 10 lectures, soit 300 pour un mois : la limite est de 1000 opérations
     par appel et de 100 000 lectures par jour. */
  const totaux = await Promise.all(dates.map(async function (d) {
    const parts = await Promise.all(
      Array.from({ length: TRANCHES }, function (_, k) { return env.COMPTEUR.get('j:' + d + ':' + k); })
    );
    return parts.reduce(function (somme, v) { return somme + (parseInt(v || '0', 10) || 0); }, 0);
  }));

  const resultat = {};
  dates.forEach(function (d, i) { resultat[d] = totaux[i]; });
  return new Response(JSON.stringify(resultat), {
    status: 200,
    headers: entetes({ 'Content-Type': 'application/json; charset=utf-8' })
  });
}

export default {
  async fetch(requete, env) {
    const url = new URL(requete.url);

    if (requete.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: entetes() });
    }
    if (requete.method === 'POST' && url.pathname === '/signal') {
      return signaler(env);
    }
    if (requete.method === 'GET' && url.pathname === '/jours') {
      return jours(env, url);
    }
    return new Response('Service de comptage e-histgeo.', {
      status: 404, headers: entetes({ 'Content-Type': 'text/plain; charset=utf-8' })
    });
  }
};
