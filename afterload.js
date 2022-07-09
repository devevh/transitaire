function ecrireOption(liste,item) {
	creerElement(liste,'option',item,'',item);
	var elmt=document.getElementById(item);
	elmt.setAttribute("value", item);
}

function construireSelectLieux() {
//creer les elements options d'un select à partir des données stockees en localstorage
//la clé de lecture est le nom du select
	if (localStorage.getItem("lieuxactifs") == "") {
		alert("stockage local ne contient pas la liste lieuxactifs");
		ecrireOption('lieudest','0');
	}
	else {
		var listelieuxTAB = localStorage.getItem("lieuxactifs").split(",");
		for (lieu of listelieuxTAB) {
			ecrireOption('lieudest',lieu);
		}
	}
}

function construireSelectDates() {
//creer les elements options d'un select à partir des données stockees en localstorage
//la clé de lecture est le nom du select
var AAAA, MM, JJ;
	if (localStorage.getItem("datesactives") == "") {
		alert("stockage local ne contient pas la liste datesactives");
		ecrireOption('datexp','0');
	}
	else {
		var listedatesTAB = localStorage.getItem("datesactives").split(",");
		for (date of listedatesTAB) {
			AAAA = date.substr(0,4);
			MM = parseInt(date.substr(5));//recuperer la valeur numérique
			MM += 1;
			MM = MM.toString().padStart(2,'0'); //padder au debut avec des 0 pour obtenir une chaine de longueur 2
			var listejoursactifsTAB = localStorage.getItem(date).split(",");
			for (jouractif of listejoursactifsTAB) {
				//calculer la date AAAA-MM-JJ ou JJ/MM/AAAAA
				JJ = jouractif.toString().padStart(2,'0');
				ecrireOption('datexp',JJ+"/"+MM+"/"+AAAA);
			}
		}
	}
}

//***********************************************
construireSelectDates();
construireSelectLieux();
//***********************************************