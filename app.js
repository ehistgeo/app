/* Améliorations d'usage, toutes facultatives : la page reste complète et
   utilisable sans ce script, qui n'intervient qu'après l'affichage.
   Rien ne sort de l'appareil : seul localStorage est utilisé, aucune requête,
   aucun cookie. Trois fonctions :
     1. la classe de l'élève est retenue au premier appui, puis mise en avant
     2. une invitation à installer l'app, effaçable définitivement
     3. une pastille de nouveauté sur les tuiles portant data-nouveau
*/
(function () {
  'use strict';

  var CLE_CLASSE = 'ehg.classe';
  var CLE_VUS = 'ehg.vus';
  var CLE_INVITE = 'ehg.invite';

  function lire(cle) {
    try { return localStorage.getItem(cle); } catch (e) { return null; }
  }
  function ecrire(cle, valeur) {
    try { localStorage.setItem(cle, valeur); } catch (e) { /* navigation privée */ }
  }

  /* ---- 1. Classe retenue ------------------------------------------------ */

  var tuilesCours = document.querySelectorAll('.tile--cours');
  var maClasse = lire(CLE_CLASSE);

  Array.prototype.forEach.call(tuilesCours, function (tuile) {
    var nom = tuile.getAttribute('data-classe');
    if (!nom) return;

    if (nom === maClasse) {
      tuile.classList.add('est-ma-classe');
      tuile.style.order = '-1';
      var mention = document.createElement('span');
      mention.className = 'sr';
      mention.textContent = ' (votre classe)';
      tuile.appendChild(mention);
    }

    tuile.addEventListener('click', function () {
      ecrire(CLE_CLASSE, nom);
    });
  });

  /* ---- 3. Pastille de nouveauté ----------------------------------------- */
  /* Pour signaler une mise à jour, ajoutez data-nouveau="…" sur une tuile,
     avec une valeur quelconque qui change à chaque nouvelle annonce, par
     exemple data-nouveau="2026-09". La pastille disparaît dès que l'élève
     ouvre la tuile, et revient si vous changez la valeur.
     Une fois la classe connue, les nouveautés des autres classes ne sont plus
     signalées : elles ne concernent pas cet élève. Tant qu'aucune classe n'est
     retenue, toutes sont signalées, pour ne rien lui cacher. */

  var vus = {};
  try { vus = JSON.parse(lire(CLE_VUS) || '{}') || {}; } catch (e) { vus = {}; }

  Array.prototype.forEach.call(document.querySelectorAll('[data-nouveau]'), function (tuile) {
    var cle = tuile.getAttribute('data-classe') || tuile.textContent.trim();
    var version = tuile.getAttribute('data-nouveau');
    if (vus[cle] === version) return;

    var estUnCours = tuile.classList.contains('tile--cours');
    if (estUnCours && maClasse && tuile.getAttribute('data-classe') !== maClasse) return;

    tuile.classList.add('est-nouveau');
    var mention = document.createElement('span');
    mention.className = 'sr';
    mention.textContent = ' (nouveau)';
    tuile.appendChild(mention);

    tuile.addEventListener('click', function () {
      vus[cle] = version;
      ecrire(CLE_VUS, JSON.stringify(vus));
    });
  });

  /* ---- 2. Invitation à installer ---------------------------------------- */

  var deja = window.matchMedia('(display-mode: standalone)').matches ||
             window.navigator.standalone === true;
  var refusee = lire(CLE_INVITE) === 'non';
  var invitationAffichee = false;
  var evenementInstall = null;

  function afficherInvitation(mode) {
    if (invitationAffichee || deja || refusee) return;
    if (!document.body) return;
    invitationAffichee = true;

    var bloc = document.createElement('aside');
    bloc.className = 'invite';

    var texte = document.createElement('p');
    texte.className = 'invite__texte';
    texte.textContent = mode === 'ios'
      ? 'Installez l’app : bouton Partager, puis « Sur l’écran d’accueil ».'
      : 'Ajoutez l’app à votre écran d’accueil.';
    bloc.appendChild(texte);

    if (mode === 'bouton') {
      var bouton = document.createElement('button');
      bouton.type = 'button';
      bouton.className = 'invite__action';
      bouton.textContent = 'Installer';
      bouton.addEventListener('click', function () {
        if (!evenementInstall) return;
        evenementInstall.prompt();
        evenementInstall = null;
        bloc.remove();
      });
      bloc.appendChild(bouton);
    }

    var fermer = document.createElement('button');
    fermer.type = 'button';
    fermer.className = 'invite__fermer';
    fermer.setAttribute('aria-label', 'Masquer définitivement cette invitation');
    fermer.textContent = '×';
    fermer.addEventListener('click', function () {
      ecrire(CLE_INVITE, 'non');
      bloc.remove();
    });
    bloc.appendChild(fermer);

    document.body.appendChild(bloc);
  }

  /* Android et ordinateurs sous Chromium : l'installation est pilotable,
     on propose donc un vrai bouton. */
  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault();
    evenementInstall = e;
    afficherInvitation('bouton');
  });

  /* iOS ne fournit aucune interface d'installation : on explique le geste. */
  var estIOS = /iPad|iPhone|iPod/.test(window.navigator.userAgent) && !window.MSStream;
  if (estIOS) afficherInvitation('ios');

  window.addEventListener('appinstalled', function () {
    ecrire(CLE_INVITE, 'non');
  });

  /* ---- 4. Confort des menus dépliants ----------------------------------- */
  /* Les menus fonctionnent entièrement en CSS. Le script n'ajoute que trois
     commodités : amener le panneau dans le champ de vision, le refermer d'un
     appui à l'extérieur, et le refermer avec la touche Échap. */

  var etats = document.querySelectorAll('.menu-etat');
  var aucun = document.getElementById('etat-aucun');

  function fermerMenus() {
    if (aucun) aucun.checked = true;
  }

  Array.prototype.forEach.call(etats, function (etat) {
    if (etat === aucun) return;
    etat.addEventListener('change', function () {
      if (!etat.checked) return;
      var panneau = document.getElementById(etat.id.replace('etat-', 'liste-'));
      if (!panneau || !panneau.scrollIntoView) return;
      var doux = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      setTimeout(function () {
        panneau.scrollIntoView({ block: 'nearest', behavior: doux ? 'smooth' : 'auto' });
      }, 60);
    });
  });

  if (etats.length) {
    document.addEventListener('click', function (e) {
      if (!e.target.closest('.menu__liste, .menu-bouton')) fermerMenus();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') fermerMenus();
    });
  }
})();
