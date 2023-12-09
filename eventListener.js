//clic sur le bouton accueil pour aller à l'accueil
document.getElementById('accueil').addEventListener('click', function(){ window.location.assign("./index.htm")});
//clic sur le bouton pour quitter l'application
document.getElementById('quitter').addEventListener('click', function(){ window.close()});
//clic sur aide pour afficher la modale d'aide
document.getElementById('aide').addEventListener('click',function(){document.getElementById('modaleAide').style.display='block';});
//clic sur le x pour fermer la modale de aide
document.getElementById('fermerAide').addEventListener('click',function(){document.getElementById('modaleAide').style.display='none';});
