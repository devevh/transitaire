/**************************************************************************************/
//fonctions appelées
/**************************************************************************************/
function stringToHash(string) {
	var hash = 0;
	if (string.length == 0) return hash;
	for (i = 0; i < string.length; i++) {
		char = string.charCodeAt(i);
		hash = ((hash << 5) - hash) + char;
		hash = hash & hash;
	}
	return hash;
}

function activerJour(jour) {
	var td=document.getElementById(jour);
	if (td.className.indexOf("date-active") == -1) {
		td.className += " date-active";
		//appeler la fonction de mise à jour du tableau des jours actifs pour ajouter le jour
	} 
	else {
		td.className = td.className.replace(" date-active","");
		//appeler la fonction de mise à jour du tableau des jours actifs pour supprimer le jour
	}
}

let ANNEE=[];
function bissextile(annee) {
	var modulo4, modulo100, modulo400;
	modulo4 = annee - Math.trunc(annee/4)*4;
	//modulo100 = annee - Math.trunc(annee/100)*100;
	modulo400 = annee - Math.trunc(annee/400)*400;
	if (modulo4 != 0 && modulo400 != 0) {
		ANNEE = ANNEENONBI;
	}
	else {
		ANNEE = ANNEEBI;
	}	
}

function creerElement(idParent,typeElement,idElmt,classe,texte) {
	var elmt = document.createElement(typeElement);
	elmt.setAttribute("id", idElmt);
	elmt.setAttribute("class", classe);
	if (texte>"") elmt.appendChild(document.createTextNode(texte));
	document.getElementById(idParent).appendChild(elmt);
}

function creerElementAvantDernier(idParent,typeElement,idElmt,classe,texte) {
	var elmt = document.createElement(typeElement);
	elmt.setAttribute("id", idElmt);
	elmt.setAttribute("class", classe);
	if (texte>"") elmt.appendChild(document.createTextNode(texte));
	var elmtparent=document.getElementById(idParent);
	elmtparent.insertBefore(elmt,elmtparent.lastElementChild);
}

/**************************************************************************************/
//fonctions dynamiques
/**************************************************************************************/
// Accordion 
function afficherSousMenu(id) {
  var div = document.getElementById(+id);
  if (div.className.indexOf("w3-show") == -1) {
	div.className = div.className.replace(" w3-hide", " w3-show");
  } 
  else {
    div.className = div.className.replace(" w3-show", " w3-hide");
  }
}

function afficherSousMenu2(id) {
  var div = document.getElementById('detail'+id);
  var v = document.getElementById("span"+id);
  if (div.className.indexOf("w3-show") == -1) {
	div.className = div.className.replace(" w3-hide", " w3-show");
	v.innerHTML="^";
  } 
  else {
    div.className = div.className.replace(" w3-show", " w3-hide");
	v.innerHTML="v";
  }
}

function afficherConfirmation() {
  var div = document.getElementById('confirmation');
  if (div.className.indexOf("w3-show") == -1) {
	div.className = div.className.replace(" w3-hide", " w3-show");
  } 
  else {
    div.className = div.className.replace(" w3-show", " w3-hide");
  }
}

function afficherMois() {
	var annee = document.getElementById('annee').value;
	var mois = document.getElementById('mois').value;
	var jours = document.getElementsByClassName('jour');
	bissextile(annee);
	var nbJours = ANNEE[mois];
	//calcul du jour de la semaine du 1er du mois 
	mois++;
	var d = new Date(annee+"-"+mois+"-01");
	var offset = d.getDay();
	//0 = dimanche, 6=samedi
	if (offset == 0) { 
		offset = 6;
	}
	else {
		offset--; //lundi=1 -> 0 et samedi=6 -> 5
	}
	// indTD : indice du poste des cases dans le calendrier
	// numJour : numéro du jour, incrémenté à partir de offset
	var indTD=0, numJour=1;
	for (indTD=0;indTD<jours.length;indTD++) {
		if (indTD < offset) {
			jours[indTD].innerHTML= "&nbsp;";
		}
		else {
			if (numJour <= nbJours) {
				jours[indTD].innerHTML=numJour;
			}
			else {
				jours[indTD].innerHTML = "&nbsp;";
			}
			numJour++;
		}
		jours[indTD].className = jours[indTD].className.replace(" date-active","");
	}
}

function monreset() {
// effacer les tous input de la page
	var lesinputs = document.getElementsByTagName("input");
	for (input of lesinputs) {
		input.value = "";
	}
}
/**************************************************************************************/
//fonctions opérationnelles
/**************************************************************************************/

//*************************************************************************************************
function afficherColis() {
//affiche la liste des colis enregistrés
var colisTXT="", colisJSON="", listeColisTAB=[], colisTAB=[], idcolis="", colis="";
var dateEnCours="", nouvelleDate="";
var descr="";

	if (localStorage.getItem('envois') > "") {
		listeColisTAB = localStorage.getItem('envois').split(",");
		for (idcolis of listeColisTAB) {
			colisTXT = localStorage.getItem(idcolis);
			colisJSON = JSON.parse(colisTXT);
			colisTAB.push(colisJSON.datexp+idcolis);
		}
		colisTAB.sort();//tri sur AAAA/MM/JJaaaa-mm-jjThh:mm:ssZ
		for (colis of colisTAB) {
			//dateEnCours = colis.substr(0,10);//recup datexp AAAA/MM/JJ
			idcolis = colis.substr(10);//recup idcolis aaaa-mm-jjThh:mm:ssZ
			colisTXT = localStorage.getItem(idcolis);
			colisJSON = JSON.parse(colisTXT);
			if (colisJSON.datexp != nouvelleDate) { //rupture sur datexp => ecrire l'entete d'expedition
				creerElement('envois','div',colisJSON.datexp,'w3-container','');	
				creerElement(colisJSON.datexp,'header','header'+colisJSON.datexp,'w3-left-align','Envoi du '+colisJSON.datexp+' ');	
				creerElement('header'+colisJSON.datexp,'span','span'+colisJSON.datexp,'w3-badge w3-grey','^');
					elmt = document.getElementById('span'+colisJSON.datexp);
					elmt.setAttribute("onclick", "afficherSousMenu2('"+colisJSON.datexp+"')");	
				creerElement(colisJSON.datexp,'div','detail'+colisJSON.datexp,'w3-container w3-show','');
				nouvelleDate = colisJSON.datexp;
			}
			//traitement systématique, ecrire le detail de chaque colis dans l'expédition
			creerElement('detail'+colisJSON.datexp,'div',idcolis,'','');
			creerElement(idcolis,'p','p'+idcolis,'','');
			creerElement('p'+idcolis,'span','nomexp'+idcolis,'w3-margin',colisJSON.nomexp+' ('+colisJSON.telexp+')');
			creerElement('p'+idcolis,'span','nomdest'+idcolis,'w3-margin',colisJSON.nomdest+' ('+colisJSON.teldest+')');
			creerElement('p'+idcolis,'span','lieu'+idcolis,'w3-margin',colisJSON.lieudest);
			creerElement('p'+idcolis,'span','span'+idcolis,'w3-badge w3-blue','v');
				elmt = document.getElementById('span'+idcolis);
				elmt.setAttribute("onclick", "afficherSousMenu2('"+idcolis+"')");
			//tronquer la description à xx caractères avec ajout de '...' à la fin si réellement tronquée
			if (colisJSON.desc.length > 25) {
				descr = colisJSON.desc.substr(0,22)+"...";
			}
			else {
				descr = colisJSON.desc;
			}
			creerElement('p'+idcolis,'div','detail'+idcolis,'w3-container w3-hide w3-text-grey w3-small',descr+' - '+colisJSON.poids+'kg - '+colisJSON.montant+'€');
		}
	}
}

function enregistrerColis() {
//enregistre le détail du colis
	var d = new Date();
	var idcolis = d.toISOString();
	var nomexp = document.getElementById("nomexp").value;
	var telexp = document.getElementById("telexp").value;
	var nomdest = document.getElementById("nomdest").value;
	var teldest = document.getElementById("teldest").value;
	var lieudest = document.getElementById("lieudest").value;
	var desc = document.getElementById("desc").value;
	var poids = document.getElementById("poids").value;
	var montant = document.getElementById("montant").value;
	var datexp = document.getElementById("datexp").value;
	var colisJSON, 
		colis= {
		"nomexp":nomexp,
		"telexp":telexp,
		"nomdest":nomdest,
		"teldest":teldest,
		"lieudest":lieudest,
		"desc":desc,
		"poids":poids,
		"montant":montant,
		"datexp":datexp
	};
	var listeColisTAB=[];
	if (localStorage.getItem('envois') > "") {
		listeColisTAB = localStorage.getItem('envois').split(",");
	}
	//conversion en JSON
	colisJSON = JSON.stringify(colis);
	//enregisrer la mise à jour
	localStorage.setItem(idcolis, colisJSON);
	listeColisTAB.push(idcolis);
	listeColisTAB.sort();
	localStorage.setItem('envois',listeColisTAB);
	//affichage confirmation
	afficherConfirmation();
	monreset();
}

function enregistrerDatesActives() {
//enregistre les dates activées
	//parcourir la liste des td :
	//  ajouter en stockage local si coché et non existant
	//  supprimer si non coché et existant
	var annee = document.getElementById("annee").value;
	var mois = document.getElementById("mois").value;
	var anneeMois = annee +'-'+ mois;
	var lesJoursActifs=[]; //tableau des jours actifs pour anneeMois
	var anneeMoisActif; //JSON qui associe anneeMois et lesJoursActifs
	var listedatesTAB=[];
	var lesjours = document.getElementsByTagName("td");
	var i, k;
	//recherche de anneeMois dans datesactives	
	if (localStorage.getItem("datesactives") > "") {
		listedatesTAB = localStorage.getItem("datesactives").split(",");
		for (i = 0; i < listedatesTAB.length; i++) {
			if (listedatesTAB[i] == anneeMois) {
				localStorage.removeItem(anneeMois);
				listedatesTAB.splice(i,1);
				listedatesTAB.sort();
				break;
			}
		}
	}
	//lecture des td pour recupérer les jours actifs de anneeMois
	for (i = 0; i < lesjours.length; i++) {
		if (lesjours[i].innerHTML != "") {
			//uniquement les cases qui contiennent une date
			if (lesjours[i].className.indexOf("date-active") >= 0) {
				//si jour est actif alors ajout dans tableau
				lesJoursActifs.push(lesjours[i].innerHTML);
			}
		}
	}
	//si des jours sont activés dans anneMois on ajoute anneeMois dans datesactives et les jours dans anneeMois
	if (lesJoursActifs.length > 0) {
		listedatesTAB.push(anneeMois);
		listedatesTAB.sort();
		localStorage.setItem("datesactives",listedatesTAB);
		localStorage.setItem(anneeMois,lesJoursActifs);
	}
	//affichage confirmation
	afficherConfirmation();
}

//ajouter nouveau lieu
function ajouterLieu(lelieu) {
	var leslieux = document.getElementsByClassName("lieu");
	var lesLieuxActifs=[];
	if (lelieu != '') {
		//ajouter la case à cocher du nouveau lieu dans le fieldset listelieux avant la ligne qui permet d'ajouter un lieu
		creerElementAvantDernier('listelieux','div','div'+lelieu,'w3-row','');
		creerElement('div'+lelieu,'div','divinput'+lelieu,'w3-col s2','');
		//ajouter l'input
		creerElement('divinput'+lelieu,'input',lelieu,'lieu','');
		//définir les attributs spécifiques de l'input pour préciser le type checkbox
		elmt=document.getElementById(lelieu);
			elmt.setAttribute("type", "checkbox");
			elmt.setAttribute("name", lelieu);
			elmt.setAttribute("value", lelieu);
		creerElement('div'+lelieu,'div','divlabel'+lelieu,'w3-col s10 w3-left-align','');
		//ajouter le label de l'input
		creerElement('divlabel'+lelieu,'label','label'+lelieu,'',lelieu);
		elmt=document.getElementById('label'+lelieu);
			elmt.setAttribute("for", lelieu);
		//raz sur la valeur de l'input nouveauLieu
		document.getElementById('nouveauLieu').value='';
		//enregistrer le nouveau lieu
		if (localStorage.getItem("nouveauxlieux") > "") {
			nvxLieuxTAB = localStorage.getItem("nouveauxlieux").split(",");
			if (!(nvxLieuxTAB.indexOf(lelieu) >= 0)) {
				nvxLieuxTAB.push(lelieu);//on ajoute le nouveau lieu si pas présent
				nvxLieuxTAB.sort();
			}
			localStorage.removeItem("nouveauxlieux");
			localStorage.setItem("nouveauxlieux",nvxLieuxTAB);
		}
		else {
			localStorage.setItem("nouveauxlieux",lelieu);
		}
	}
	//affichage confirmation
	afficherConfirmation();
}

function enregistrerLieuxActifs() {
//enregistre les lieux activés
	//parcourir la liste des checkbox  :
	//  ajouter en stockage local si coché et non existant
	//  supprimer si non coché et existant
	var lieuxActifs, lesLieuxActifs=[];
	var leslieux = document.getElementsByClassName("lieu");
	
	for (i = 0; i < leslieux.length; i++) {
		if (leslieux[i].checked) {
			//uniquement les cases cochées
			lesLieuxActifs.push(leslieux[i].value);
		}
	}
	if (lesLieuxActifs.length == 0) {
		if (confirm('Etes-vous sûr(e) de vouloir désactiver touts les lieux ?')) {
			localStorage.removeItem("lieuxactifs");
		}
	}
	else {
		localStorage.removeItem("lieuxactifs");
		localStorage.setItem("lieuxactifs",lesLieuxActifs);
	}
	//affichage confirmation
	afficherConfirmation();
}

//************************************************************************
//usage futur : geolocalisation
/*
var p=document.getElementById('affichePosition');
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else { 
    p.innerHTML = "Geolocation is not supported by this browser.";
  }
}

function showPosition(position) {
  p.innerHTML = "Latitude: " + position.coords.latitude + " - Longitude: " + position.coords.longitude;
}
getLocation();
*/