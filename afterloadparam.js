function decocherTouteslesDates() {
	var lesjours = document.getElementsByTagName("td");
	for (i = 0; i < lesjours.length; i++) {
		if (lesjours[i].className.indexOf("date-active") >= 0) lesjours[i].className = lesjours[i].className.replace(" date-active","");
	}
}

function cocherLieuxActifs() {
//cocher les lieux actifs
	if (localStorage.getItem("lieuxactifs") > "") {
		var listelieuxTAB = localStorage.getItem("lieuxactifs").split(",");
		for (lieu of listelieuxTAB) {
			if (!(document.getElementById(lieu))) {
				ajouterLieu(lieu);
			}
			document.getElementById(lieu).checked = true;
		}
	}
}

function cocherDatesActives() {
	var annee = document.getElementById("annee").value;
	var mois = document.getElementById("mois").value;
	var lesjours = document.getElementsByTagName("td");
	var anneeMois = annee +'-'+ mois;
	var AAAA, MM, JJ;
	var jourControle=0, dernierJourActif=0;
	decocherTouteslesDates();
	if (localStorage.getItem("datesactives") > "") {
		var listejoursactifsTAB = localStorage.getItem(anneeMois).split(",");
		for (jouractif of listejoursactifsTAB) {
			for (jourControle = dernierJourActif; jourControle < lesjours.length; jourControle++) {
				if (lesjours[jourControle].innerHTML == jouractif) {
					//uniquement les cases qui contiennent une date
					lesjours[jourControle].className += " date-active";
					dernierJourActif = jourControle;
					break;
				}
			}
		}
	}
}

//***********************************************
cocherLieuxActifs();
cocherDatesActives();
//***********************************************