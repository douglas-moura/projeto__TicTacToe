// sessão onde é renderizado a grade do jogo
const blocoJogo = document.getElementById("bloco-jogo");
// campo onde indica de quem é a vez
const vez = document.getElementById("vez");
// sequências de vitórias possiveis no jogo
const vitoriasPossiveis = [
    [0, 1, 2, "lin-1"],
    [3, 4, 5, "lin-2"],
    [6, 7, 8, "lin-3"],
    [0, 3, 6, "lin-4"],
    [1, 4, 7, "lin-5"],
    [2, 5, 8, "lin-6"],
    [0, 4, 8, "lin-7"],
    [2, 4, 6, "lin-8"]
];
// número de jogadas feitas
let jogadas = 0;
// variável onde será guardado o vencedor
let vencedor = null;

// renderizando nove blocos
for (let i = 0; i < 9; i++) {
    blocoJogo.innerHTML += `<div id='bloco-${i}' onclick="jogar(${i})" class="box"></div>`;
}

function jogar(id) {
    // pega o bloco o de acordo com a ID passada no parâmetro
    let box = document.getElementById("bloco-" + id);
    // verifica se o bloco já esta preenchido, para evitar sobreposição de símbolos
    if (box.innerHTML == "") {
        // o simbolo é definido chamando uma função onde é pessado um número impa ou par
        let simbolo = defineSimbolo(jogadas % 2);
        // insere o simbolo recebido da função no bloco
        box.innerHTML = '<span class="flex w-4/6 aspect-square m-auto">' + simbolo + "</span>";
        // soma mais 1 na variável jogadas
        jogadas++;
        // informa de quem a vez
        vez.innerHTML = `<p class="font-extrabold">É a vez do: </p><div class="flex aspect-square ml-1 w-1/12">${defineSimbolo(jogadas % 2)}</div>`;
        // chama variável para verificar se o jogador venceu nesta jogada
        defineResultado(simbolo);
    }
}

function defineSimbolo(calc) {
    // se o valor calculado de (JOGADAS % 2) e recebido no parâmetro for 1 (impar), o simbolo será um circulo, senão será um X
    return calc == 1
        ? '<svg class="simbolo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M12 22q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22m0-2q3.35 0 5.675-2.325T20 12t-2.325-5.675T12 4T6.325 6.325T4 12t2.325 5.675T12 20m0-8"></path></svg>'
        : '<svg class="simbolo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="m12 13.4l-4.9 4.9q-.275.275-.7.275t-.7-.275t-.275-.7t.275-.7l4.9-4.9l-4.9-4.9q-.275-.275-.275-.7t.275-.7t.7-.275t.7.275l4.9 4.9l4.9-4.9q.275-.275.7-.275t.7.275t.275.7t-.275.7L13.4 12l4.9 4.9q.275.275.275.7t-.275.7t-.7.275t-.7-.275z"></path></svg>';
}

function defineResultado(simb) {
    // busca todos os blocos para checar o conteúdo de cada um
    const blocos = document.querySelectorAll("div.box");
    // variável Array vazia
    let blocosSelct = [];
    for (let i = 0; i < blocos.length; i++) {
        // se o conteúdo do bloco for igual ao símbolo recem jogado, o ID será inserido na Array vazia declarada acima
        if (blocos[i].innerHTML == '<span class="flex w-4/6 aspect-square m-auto">' + simb + "</span>") {
            blocosSelct.push(i);
        }
    }
    // verifica se o simbolo foi jogado pelo menos 3 vezes para evitar comparações desnecessárias
    if (blocosSelct.length > 2) {
        // variável para checar se já há uma combinação vencedora, evitando bugs por combinações de vitórias duplas
        let checagem = false;
        vitoriasPossiveis.forEach(vit => {
            if (!checagem) {
                // parte "central" do jogo
                // este IF verifica se o Array blocosSelct possuiu alguma das combinações de vitorias possiveis
                // como o blocosSelct pode ter valores de IDs que "corrempe" uma combinação vencedora
                // o uso do INCLUDES é o ideal para ignorar estes IDs
                // exemplo: [0, 3, 4, 8], o INCLUDES ignora o 3
                if (blocosSelct.includes(vit[0]) && blocosSelct.includes(vit[1]) && blocosSelct.includes(vit[2])) {
                    // define o simbolo com vencedor
                    vencedor = simb;
                    // traça uma linha de acordo com a combinação
                    tracarLinha(vit[3]);
                    // mostra box informando o vencedor da partida
                    mostraVencedor(
                        `<p class="mb-2 font-extrabold">Vencedor</p>
						<div class="flex flex-col w-2/4 box-border aspect-square item-center">
							${simb}
						</div>
					`
                    );
                    //define checagem como TRUE para evitar bugs com vitorias duplas
                    checagem = true;
                }
            }
        });
        // verifica quantidade de jogadas e se há um vencedor definido
        // se chegou à 9 jogadas sem um vencedor, o jogo declara um empate
        if (jogadas > 8 && vencedor == null) {
            mostraVencedor("Empatou");
        }
    }
}

function mostraVencedor(msg) {
    // função que cria o bloco que anuncia o vencedor com um botão para reiniciar o jogo
    const blocoVencedor = document.getElementById("bloco-vencedor");
    blocoVencedor.innerHTML += msg;
    blocoVencedor.innerHTML += `<button class="text-yellow-500 mt-8 py-2 px-4 border-2 border-yellow-500 rounded" onclick="window.location.reload();">Reiniciar</button>`;
    setTimeout(function () {
        blocoVencedor.classList.remove("invisible");
        blocoVencedor.classList.remove("-translate-y-full");
    }, 1000);
}

function tracarLinha(direcao) {
    // DIV da "invisivel" da largura do quadriculado geral
    let blocoLinha = document.getElementById("bloco-linha");
    // DIV invisivel com largura ou altura de 1/3 da DIV invisivel maior
    // com isso ela pode se alinhar perfeitamente com qualquer linha ou coluna
    let linha = document.getElementById("linha");
    // HR dentro da DIV 1/3, ele é a linha que o usiário vê quando vence
    let traco = document.querySelector("hr.traco-vitoria");
    // exibe a linha
    blocoLinha.classList.remove("hidden");
    // este SWITCH recebe a direção do traço de acordo com combinação vitoriosa
    // com isto, as DIVs invisiveis e o HR recebem estilos para posiciona-los de acordo com a linha ou coluna com a combinação vitoriosa
    // o SETTIMEOUT serve para o efeito no traço funcionar
    switch (direcao) {
        case "lin-1":
            linha.classList.add("linha-vit-01");
            setTimeout(function () {
                traco.classList.add("w-4/5");
            }, 10);
            break;
        case "lin-2":
            linha.classList.add("linha-vit-02");
            setTimeout(function () {
                traco.classList.add("w-4/5");
            }, 10);
            break;
        case "lin-3":
            linha.classList.add("linha-vit-03");
            setTimeout(function () {
                traco.classList.add("w-4/5");
            }, 10);
            break;
        case "lin-4":
            blocoLinha.classList.add("rotate-90");
            linha.classList.add("linha-vit-03");
            setTimeout(function () {
                traco.classList.add("w-4/5");
            }, 10);
            break;
        case "lin-5":
            blocoLinha.classList.add("rotate-90");
            linha.classList.add("linha-vit-02");
            setTimeout(function () {
                traco.classList.add("w-4/5");
            }, 10);
            break;
        case "lin-6":
            blocoLinha.classList.add("rotate-90");
            linha.classList.add("linha-vit-01");
            setTimeout(function () {
                traco.classList.add("w-4/5");
            }, 10);
            break;
        case "lin-7":
            blocoLinha.classList.add("rotate-45");
            linha.classList.add("linha-vit-02");
            setTimeout(function () {
                traco.classList.add("w-120");
            }, 10);
            break;
        case "lin-8":
            blocoLinha.classList.add("-rotate-45");
            linha.classList.add("linha-vit-02");
            setTimeout(function () {
                traco.classList.add("w-120");
            }, 10);
            break;
        default:
            blocoLinha.classList.remove("hidden");
    }
}