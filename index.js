
estado = [];
var raiz;
var atual;

var pilha = [];
var nodos = 0;


window.onload = function () {
	inicializa();
};

function inicializa() {
	estado = [[], [], []];
	raiz = null;
	atual = null;

	exibeEstado(estado);
}

function geraArvore() {
	pilha = [];
	nodos = 0;
	raiz = { pai: null, estado: estado, filhos: [], jogador: "O", minimax: null };
	pilha.push(raiz);


	while (pilha.length) {
		nodo = pilha.pop();
		geraFilhos(nodo);
	}

	calculaMinimax(raiz);
	atual = raiz;
}


function geraFilhos(pai) {
	var estado = [];
	var x, y, minimax;
	var jogador = (pai.jogador == "x") ? "o" : "x";

	for (y = 0; y < 3; y++)
		for (x = 0; x < 3; x++)
			if (pai.estado[y][x] == undefined) {
				estado = copiaEstado(pai.estado);
				estado[y][x] = jogador;
				var nodo = { pai: pai, estado: estado, filhos: [], jogador: jogador, minimax: null };

				nodo.minimax = ehTerminal(nodo.estado, 0);
				pai.filhos.push(nodo);
				nodos++;

				if (!nodo.minimax)
					pilha.push(nodo);
			}
}

function calculaMinimax(nodo) {
	var i, min, max;
	for (i = 0; i < nodo.filhos.length; i++) {
		if (nodo.filhos[i].minimax === null)
			calculaMinimax(nodo.filhos[i]);

		if (max == undefined || nodo.filhos[i].minimax > max)
			max = nodo.filhos[i].minimax;
		if (min == undefined || nodo.filhos[i].minimax < min)
			min = nodo.filhos[i].minimax;
	}
	if (nodo.jogador == "o")
		nodo.minimax = max;
	nodo.minimax = min;
}

function ehTerminal(estado, encerra) {
	var x, y;
	var brancos = 0;
	var utilidade = null;

	for (y = 0; y < 3; y++)
		if (estado[y][0] != undefined && estado[y][0] == estado[y][1] && estado[y][0] == estado[y][2]) {
			utilidade = (estado[y][0] == "x") ? 1 : -1;
		}
	if (!utilidade)
		for (x = 0; x < 3; x++)
			if (estado[0][x] != undefined && estado[0][x] == estado[1][x] && estado[0][x] == estado[2][x]) {
				utilidade = (estado[0][x] == "x") ? 1 : -1;
				break;
			}
	if (!utilidade)
		if (estado[1][1] != undefined && (
			(estado[0][0] == estado[1][1] && estado[0][0] == estado[2][2]) ||
			(estado[0][2] == estado[1][1] && estado[0][2] == estado[2][0])))
			utilidade = (estado[1][1] == "x") ? 1 : -1;

	for (y = 0; y < 3; y++)
		for (x = 0; x < 3; x++)
			if (estado[y][x] == undefined)
				brancos++;

	if (utilidade)
		if (encerra)
			if (utilidade > 0) {
				showMessage("Perdeu Playboy", "Eu ganhei ^^");
				inicializa();
			}
			else {
				showMessage("Comassim???? :'(", "Você ganhou");
				inicializa();
			}
		else
			return utilidade * (brancos + 1);

	else
		if (!brancos)
			if (encerra) {
				showMessage("De novo...", "Empatamos .-.");
				inicializa();
			}
			else
				return 0;
		else
			return null;
}


function jogaHumano(elemento) {
	var i = Number(elemento[0]);
	var j = Number(elemento[1]);

	if (estado[i][j] != undefined) {
		showMessage("Posição inválida", i.toString() + j.toString());
		return;
	}
	else {
		estado[i][j] = "o";
		exibeEstado(estado);
	}

	if (!ehTerminal(estado, 1)) {
		if (!raiz)
			geraArvore();
		else
			for (i = 0; i < atual.filhos.length; i++)
				if (comparaEstados(estado, atual.filhos[i].estado)) {
					atual = atual.filhos[i];
					break;
				}
		jogaCPU();
	}
}

function jogaCPU() {
	var max;
	var opcoes = [];
	var i, r;

	if (!raiz)
		geraArvore();

	for (i = 0; i < atual.filhos.length; i++) {
		if (atual.filhos[i].minimax != null && (max == undefined || atual.filhos[i].minimax > max))
			max = atual.filhos[i].minimax;
	}

	for (i = 0; i < atual.filhos.length; i++)
		if (atual.filhos[i].minimax == max)
			opcoes.push(i);

	r = Math.floor(Math.random() * opcoes.length);
	atual = atual.filhos[opcoes[r]];
	estado = atual.estado;
	exibeEstado(estado);

	ehTerminal(estado, 1);
}

function exibeEstado(estado) {
	for (var i = 0; i < 3; i++)
		for (var j = 0; j < 3; j++) {
			elemento = document.getElementById(i.toString() + j.toString());
			if (estado[i][j] == undefined)
				elemento.innerHTML = "&nbsp;";
			else
				elemento.innerHTML = estado[i][j];
		}
}

function showMessage(msg, winner = "") {
	document.getElementById("winner").innerText = winner;
	document.getElementById("text").innerText = msg;
	document.getElementById("open").click();
}


function copiaEstado(estado) {
	var retorno = [];
	for (var i = 0; i < estado.length; i++)
		retorno[i] = estado[i].slice(0);

	return retorno;
}

function comparaEstados(estado1, estado2) {
	for (var i = 0; i < 3; i++)
		for (var j = 0; j < 3; j++)
			if (estado1[i][j] != estado2[i][j])
				return false;

	return true;
}