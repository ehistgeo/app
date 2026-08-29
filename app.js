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
  var CLE_THEME = 'ehg.theme';
  var CLE_ACCUEIL = 'ehg.accueil';

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

  /* Connu dès le départ, car beforeinstallprompt peut survenir avant que le
     message d'accueil ne soit construit. */
  var accueilOuvert = !lire(CLE_ACCUEIL) && typeof window.HTMLDialogElement === 'function';
  var invitationEnAttente = null;

  var deja = window.matchMedia('(display-mode: standalone)').matches ||
             window.navigator.standalone === true;
  var refusee = lire(CLE_INVITE) === 'non';
  var invitationAffichee = false;
  var evenementInstall = null;

  function afficherInvitation(mode) {
    if (invitationAffichee || deja || refusee) return;
    /* Le message de première visite occupe déjà l'écran : on attend qu'il soit
       refermé plutôt que d'empiler deux sollicitations. */
    if (accueilOuvert) { invitationEnAttente = mode; return; }
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

  /* ---- 7. Focus retenu apres un clic -------------------------------------
     Un lien garde le focus apres avoir ete clique. Il ne porte alors aucun
     anneau, le navigateur sachant que le pointeur a servi. Mais si l'eleve
     revient ensuite sur l'onglet au clavier, par Alt+Tab ou Ctrl+Tab, le
     navigateur bascule en mode clavier et promeut ce focus retenu en
     focus-visible : l'anneau apparait alors autour d'une tuile que personne
     n'a atteinte au clavier. On relache donc le focus apres une activation
     au pointeur. detail vaut 0 pour une activation au clavier, qui doit
     conserver son focus et son anneau. */

  /* Trois familles gardent le focus apres un clic : les liens qui ouvrent
     un onglet, les boutons radio commandes par les tuiles a menu, et les
     boutons de theme. On regarde l'element reellement focalise, car cliquer
     un libelle deplace le focus sur le bouton radio qu'il commande, non sur
     le libelle. Relacher le focus d'un bouton radio ne le decoche pas. */
  var A_RELACHER = 'a[target="_blank"], .menu-etat, .theme__b';

  document.addEventListener('click', function (e) {
    if (!e.detail) return;
    var actif = document.activeElement;
    if (actif && actif.matches && actif.matches(A_RELACHER) && actif.blur) actif.blur();
  });

  /* ---- 6. Message de première visite ------------------------------------
     Affiché une seule fois, puis jamais plus : la marque est posée dans
     localStorage sous ehg.accueil. Le dialogue est construit ici plutôt
     qu'écrit dans le HTML, pour qu'il n'existe pas du tout si le script ne
     s'exécute pas, et pour ne rien coûter en hauteur de page.
     L'élément dialog apporte gratuitement le piège de focus, la fermeture
     par Échap et l'arrière-plan assombri. */

  function messageAccueil() {
    if (!accueilOuvert) return;
    if (!document.body) { accueilOuvert = false; return; }

    var boite = document.createElement('dialog');
    boite.className = 'accueil';
    boite.setAttribute('aria-labelledby', 'accueil-titre');

    var titre = document.createElement('h2');
    titre.className = 'accueil__titre';
    titre.id = 'accueil-titre';
    titre.textContent = 'Bienvenue sur l’app e-histgeo';
    boite.appendChild(titre);

    var texte = document.createElement('p');
    texte.className = 'accueil__texte';
    texte.textContent = 'Cette application, conçue par votre Professeur, est ' +
      'exclusivement réservée aux élèves de M. PLANCHOT-GEFFARD. Il vous est ' +
      'fortement conseillé de la mettre en favoris sur votre ordinateur et de ' +
      'l’épingler sur votre smartphone.';
    boite.appendChild(texte);

    var voeux = document.createElement('p');
    voeux.className = 'accueil__voeux';
    voeux.textContent = 'Excellente rentrée à vous.';
    boite.appendChild(voeux);

    var bouton = document.createElement('button');
    bouton.type = 'button';
    bouton.className = 'accueil__action';
    bouton.textContent = 'Commencer';
    boite.appendChild(bouton);

    function refermer() {
      ecrire(CLE_ACCUEIL, '1');
      accueilOuvert = false;
      if (boite.open) boite.close();
      boite.remove();
      if (invitationEnAttente) {
        var mode = invitationEnAttente;
        invitationEnAttente = null;
        afficherInvitation(mode);
      }
    }

    bouton.addEventListener('click', refermer);
    /* Échap et le clic sur l'arrière-plan ferment aussi, comme partout ailleurs
       dans l'app. La marque est posée dans les deux cas : le message a été lu. */
    boite.addEventListener('cancel', function (e) { e.preventDefault(); refermer(); });
    boite.addEventListener('click', function (e) { if (e.target === boite) refermer(); });

    /* Le focus va sur le dialogue lui-meme, pas sur le bouton : sinon
       l'anneau de focus s'affiche des l'ouverture, alors que l'eleve n'a
       rien fait au clavier. Il reapparait normalement des la premiere
       tabulation. */
    boite.setAttribute('tabindex', '-1');
    document.body.appendChild(boite);
    accueilOuvert = true;
    boite.showModal();
    boite.focus();
  }

  messageAccueil();

  /* ---- 5. Choix du thème -------------------------------------------------
     Trois états : auto, clair, sombre. Le script en ligne du <head> a déjà
     posé data-theme avant le premier affichage ; il ne reste ici qu'à
     réagir aux clics, à retenir le choix, et à tenir à jour la couleur de
     la barre système ainsi que l'état annoncé aux lecteurs d'écran. */

  var boutonsTheme = document.querySelectorAll('.theme__b');
  var metaCouleur = document.getElementById('couleur-theme');

  function themeCourant() {
    return document.documentElement.getAttribute('data-theme') || 'auto';
  }

  function appliquerTheme(choix) {
    var racine = document.documentElement;
    if (choix === 'auto') racine.removeAttribute('data-theme');
    else racine.setAttribute('data-theme', choix);

    var sombre = choix === 'dark' ||
      (choix === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (metaCouleur) metaCouleur.setAttribute('content', sombre ? '#0B1320' : '#12335C');

    Array.prototype.forEach.call(boutonsTheme, function (b) {
      b.setAttribute('aria-pressed', b.getAttribute('data-theme-choix') === choix ? 'true' : 'false');
    });
  }

  Array.prototype.forEach.call(boutonsTheme, function (bouton) {
    bouton.addEventListener('click', function () {
      var choix = bouton.getAttribute('data-theme-choix');
      ecrire(CLE_THEME, choix);
      appliquerTheme(choix);
    });
  });

  if (boutonsTheme.length) {
    appliquerTheme(themeCourant());
    /* En mode auto, suivre le système s'il change en cours de session. */
    var sonde = window.matchMedia('(prefers-color-scheme: dark)');
    var suivre = function () { if (themeCourant() === 'auto') appliquerTheme('auto'); };
    if (sonde.addEventListener) sonde.addEventListener('change', suivre);
    else if (sonde.addListener) sonde.addListener(suivre);
  }

  /* ---- 4. Confort des menus dépliants ----------------------------------- */
  /* Les menus fonctionnent entièrement en CSS. Le script n'ajoute que trois
     commodités : amener le panneau dans le champ de vision, le refermer d'un
     appui à l'extérieur, et le refermer avec la touche Échap. */

  var etats = document.querySelectorAll('.menu-etat');

  /* Refermer, c'est decocher les quatre boutons radio. Un cinquieme bouton
     portant l'etat ferme serait plus simple, mais il resterait dans le cycle
     des fleches sans libelle ni anneau : l'eleve tomberait sur un arret
     invisible. */
  function fermerMenus() {
    Array.prototype.forEach.call(etats, function (etat) { etat.checked = false; });
  }

  Array.prototype.forEach.call(etats, function (etat) {
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
    /* Attention : cliquer un libellé provoque DEUX clics. Le premier a pour
       cible le libellé, le second, synthétique, a pour cible le bouton radio
       qu'il commande. Ce dernier doit donc être reconnu ici, sans quoi le menu
       se referme dans le geste même qui l'ouvre. */
    document.addEventListener('click', function (e) {
      var cible = e.target;
      if (!cible || !cible.closest) return;
      if (cible.closest('.menu__liste, .menu-bouton, .menu-etat')) return;
      fermerMenus();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') fermerMenus();
    });
  }
})();
