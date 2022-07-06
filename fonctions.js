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

function gestionAffichage(truc) {
	let DId, PId, SId;
	//gestion de l'affichage du truc
	var texte = localStorage.getItem(truc);
	var obj = JSON.parse(texte);
	//identifier l'article
	PId=document.getElementById("reel"+truc+"prix");
	SId=document.getElementById("reel"+truc+"stock");
	DId=document.getElementById("div"+truc);
	//mettre à jour l'affichage du prix et du stock
	if (PId) PId.innerHTML = obj.prix+" xaf";
	if (SId) SId.innerHTML = obj.stock;
	//si le stock devient nul alors on rend l'article indisponible
	if (DId) {
		if (obj.stock == 0) {
			DId.className +=" w3-disabled";
		}
		else {
			if (DId.className.indexOf(" w3-disabled") > -1) DId.className = DId.className.replace(" w3-disabled", "");
		}
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
	if (lelieu != '') {
		//ajouter la case à cocher du nouveau lieu dans le fieldset listelieux avant la ligne qui permet d'ajouter un lieu
		creerElementAvantDernier('listelieux','div','div'+lelieu,'w3-row','');
		creerElement('div'+lelieu,'div','divinput'+lelieu,'w3-col s2','');
		//ajouter l'input
		creerElement('divinput'+lelieu,'input',lelieu,lelieu,'');
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
function vendre(truc) {
//met à jour le stock et la vente de l'article
//anime le champ stock
//calcule l'affichage en fonction du stock restant
	var texte = localStorage.getItem(truc);
	var obj = JSON.parse(texte);
	var stocktruc = document.getElementById("reel"+truc+"stock");
	var divtruc = document.getElementById("div"+truc);
	var article, articleJSON;
	var timer;
	
	clearTimeout(timer);
	enleverClasseVente(stocktruc);
	if (obj.stock > 0) {
	//si stock suffisant alors la vente est possible : mettre à jour stock et vente
		obj.vente += 1;
		obj.stock -= 1;
		article = { "stock":obj.stock, "vente":obj.vente, "prix":obj.prix };
		articleJSON = JSON.stringify(article);
	//enregisrer la mise à jour
		localStorage.setItem(truc, articleJSON);
		stocktruc.innerHTML = obj.stock;
	//animation du champ stock
		stocktruc.className += " vente";
	}
	if (obj.stock == 0) {
	//gestion de l'article si stock nul
		divtruc.className +=" w3-disabled";
	}
	else {
		if (divtruc.className.indexOf(" w3-disabled") > 0) divtruc.className = divtruc.className.replace(" w3-disabled", "");
	}
	readValue("tableau");
	//préparation pour la prochaine vente
	timer=setTimeout(enleverClasseVente,500,stocktruc);
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