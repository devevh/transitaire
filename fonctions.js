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

function recharge() {
	location.reload();
}

function enleverClasseVente(truc) {
	if (truc.className.indexOf(" vente") > 0) truc.className = truc.className.replace(" vente", "");
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
	//insertBefore
	//var parent=document.getElementById(idParent);
	//parent.insertBefore(elmt,parent.lastChild);
}

function creerElementAvantDernier(idParent,typeElement,idElmt,classe,texte) {
	var elmt = document.createElement(typeElement);
	elmt.setAttribute("id", idElmt);
	elmt.setAttribute("class", classe);
	if (texte>"") elmt.appendChild(document.createTextNode(texte));
	//document.getElementById(idParent).appendChild(elmt);
	//insertBefore
	var elmtparent=document.getElementById(idParent);
	elmtparent.insertBefore(elmt,elmtparent.lastElementChild);
}

/**************************************************************************************/
//fonctions dynamiques
/**************************************************************************************/
// Accordion 
function afficherSousMenu(id) {
	var quelexp = id.substr(1);
  var div = document.getElementById('detail'+quelexp);
  var v = document.getElementById(id);
  if (div.className.indexOf("w3-show") == -1) {
	div.className = div.className.replace(" w3-hide", " w3-show");
	v.innerHTML="^";
  } 
  else {
    div.className = div.className.replace(" w3-show", " w3-hide");
	v.innerHTML="v";
  }
}

//ajouter nouveau lieu
function ajouterLieu(lelieu) {
	//alert('ajouterLieu');
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
		
		//parcourir les cases de classe lieu
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
	}
	
}

function afficherMois() {
	var annee = document.getElementById('annee').value;
	var mois = document.getElementById('mois').value;
	var jours = document.getElementsByClassName('jour');
	bissextile(annee);
	var nbJours = ANNEE[mois];
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
	// i:indice du poste des cases dans le calendrier
	// j:numéro du jour, incrémenté à partir de offset
	var j=1;
	for (i=0;i<41;i++) {
		if (i < offset) {
			jours[i].innerHTML= "";
		}
		else {
			if (j <= nbJours) {
				jours[i].innerHTML=j;
			}
			else {
				jours[i].innerHTML = "";
			}
			j++;
		}
		jours[i].className = jours[i].className.replace(" date-active","");
	}
}
/**************************************************************************************/
//fonctions opérationnelles
/**************************************************************************************/

//******************************************************************************************************
function readValue(quellediv) {
	//mise à jour du tableau des ventes
	let d = document.getElementById(quellediv);
	let tableau, truc, texte, obj;
	d.innerHTML = "";
	if (localStorage.length == 0) {
		d.innerHTML = "Aucun inventaire disponible";
	}
	else {
		tableau = "<table class='w3-table-all'><tr><th>Article</th><th class='w3-right-align'>Stock</th><th class='w3-right-align'>Ventes</th><th class='w3-right-align'>Prix</th><th class='w3-right-align'>Montant</th></tr>\n";
		for (i = 0; i < localStorage.length; i++) {
			truc = localStorage.key(i);
			//test de la clé pour ne pas lire les histo
			if (!(truc.startsWith('20'))) {
				texte = localStorage.getItem(truc);
				obj = JSON.parse(texte);
				tableau += "<tr><td>"+truc+"</td><td class='w3-right-align'>"+obj.stock+"</td><td class='w3-right-align'>"+obj.vente+"</td><td class='w3-right-align'>"+obj.prix+"</td><td class='w3-right-align'>"+obj.prix*obj.vente+"</td></tr>\n";
			}
		}
		tableau +="</table>";
		d.innerHTML += tableau;
	}
}

//*************************************************************************************************
function afficherColis() {
//affiche la liste des colis enregistrés
var colisTXT="", colisJSON="", listeColisTAB=[], colisTAB=[], idcolis="", colis="";
var dateEnCours="", nouvelleDate="";

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
			if (colisJSON.datexp != nouvelleDate) { //rupture sur datexp
				//il faut ecrire dans la div <div class="w3-padding-top-32 w3-wide" id="envois">Liste des colis</div>
				/*
				<div class="w3-container" id="d1">
					<header class="w3-left-align">Date jj/mm/aaaaa <span id="vdate1" class="w3-badge w3-grey" onclick="afficherSousMenu(this.id)" title="clic pour le détail">^</span></header>
						<div id="detaildate1" class="w3-container w3-show">
				*/
				//creerElement(idParent,typeElement,idElmt,classe,texte)
				creerElement('envois','div',colisJSON.datexp,'w3-container','');	
				creerElement(colisJSON.datexp,'header','header'+colisJSON.datexp,'w3-left-align','Envoi du '+colisJSON.datexp+' ');	
				creerElement('header'+colisJSON.datexp,'span','span'+colisJSON.datexp,'w3-badge w3-grey','^');
					elmt = document.getElementById('span'+colisJSON.datexp);
					elmt.setAttribute("onclick", "afficherSousMenu('detail"+colisJSON.datexp+"')");	
				creerElement(colisJSON.datexp,'div','detail'+colisJSON.datexp,'w3-container w3-show','');
				nouvelleDate = colisJSON.datexp;
			}
			//traitement systématique, il faut écrire dans la div 'detail'+colisJSON.datexp
			/*
			<div class="" id="exp1">
				<p><span id="" title="TelEXP">Exp</span> - <span id="" title="TelDEST">Dest</span> - Lieu - <span id="vexp1" class="w3-badge w3-blue" onclick="afficherSousMenu(this.id)" title="clic pour le détail">v</span>
				</p>
			<div id="detailexp1" class="w3-container w3-hide w3-text-grey w3-small">description - poids - montant</div>
			*/
			creerElement('detail'+colisJSON.datexp,'div',idcolis,'','');
			creerElement(idcolis,'p','p'+idcolis,'','');
			creerElement('p'+idcolis,'span','nomexp'+idcolis,'w3-margin',colisJSON.nomexp);
				elmt = document.getElementById('nomexp'+idcolis);
				elmt.setAttribute("title", colisJSON.telexp);
			creerElement('p'+idcolis,'span','nomdest'+idcolis,'w3-margin',colisJSON.nomdest);
				elmt = document.getElementById('nomdest'+idcolis);
				elmt.setAttribute("title", colisJSON.teldest);
			creerElement('p'+idcolis,'span','lieu'+idcolis,'w3-margin',colisJSON.lieudest);
			creerElement('p'+idcolis,'span','span'+idcolis,'w3-badge w3-blue','v');
				elmt = document.getElementById('span'+idcolis);
				elmt.setAttribute("onclick", "afficherSousMenu('detail"+idcolis+"')");
			creerElement('p'+idcolis,'div','detail'+idcolis,'w3-container w3-hide w3-text-grey w3-small',colisJSON.desc+' - '+colisJSON.poids+'kg - '+colisJSON.montant+'€');
		}
	}
}

function enregistrerColis() {
//met à jour le stock et la vente de l'article
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
}

function enregistrerDatesActives() {
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
	
	//si des jours sont actives dans anneMois on ajoute anneeMois dans datesactives et les jours dans anneeMois
	if (lesJoursActifs.length > 0) {
		listedatesTAB.push(anneeMois);
		listedatesTAB.sort();
		localStorage.setItem("datesactives",listedatesTAB);
		localStorage.setItem(anneeMois,lesJoursActifs);
	}
}

function enregistrerLieuxActifs() {
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
}

//***********************************************************************************************
function maj(truc) {
	//met à jour le stock, le prix unitaire et remet à 0 le nombre de vente
	// récupérer le prix saisi
	var prix = Math.floor(document.getElementById("prix"+truc).value);
	// récupérer le stock saisi
	var stock = Math.floor(document.getElementById("stock"+truc).value);
	if ((stock === 0) || (prix === 0)) {stock=0; prix=0};
	// Storing data
	var article = {"stock":stock,"vente":0,"prix":prix};
	var articleJSON = JSON.stringify(article);
	if ((stock >= 0) && (prix >= 0)) localStorage.setItem(truc, articleJSON);
	gestionAffichage(truc);
	//mettre à jour le tableau de suivi du stock et des ventes
	readValue("tableau");
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
