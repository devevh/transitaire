function construireSelectLieux() {
//creer les elements options d'un select à partir des données stockees en localstorage
//la clé de lecture est le nom du select
	var listelieuxTXT = localStorage.getItem("lieuxactifs");
	if (listelieuxTXT == "") {
		alert("stockage local ne contient pas la liste lieuxactifs");
	}
	else {
		var listelieuxTAB = listelieuxTXT.split(",");
		listelieuxTAB.forEach(ecrireOption);
	}
}

function ecrireOption(item) {
	//creerElement(idParent,typeElement,idElmt,classe,texte)
	creerElement('lieudest','option',item,'',item);
	elmt=document.getElementById(item);
	elmt.setAttribute("value", item);
}

construireSelectLieux();