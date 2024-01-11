// ARRAYS
var arrPalavras = ['abacaxi', 'banana', 'morango', 'abacate', 'kiwi', 'tomate', 'laranja', 'manga', 'tangerina', 'damasco', 'amarelo', 'verde', 'vermelho', 'preto', 'cinza', 'roxo', 'rosa', 'branco', 'ciano', 'azul'];
var arrExibicao = ['_', '_', '_', '_', '_', '_', '_', '_', '_', '_'];
var arrLetrasChutadas = [];

// VARIAVEIS
var estado = 'aguardando chute';
var separador = '';
var vidas = 6;
var letraTemp; 
var acertou = false;
var quantidade = arrPalavras.length - 1;
var random = Math.round(Math.random() * quantidade);
var palavra = arrPalavras[random];
var tamanho = palavra.length;

while(arrExibicao.length > tamanho){ // AJUSTE PARA QUANTIDADE DE CARACTERES NECESSARIOS
  arrExibicao.pop('_');
}

class Forca{
  chutar(letra){
    if(letra.length >= 2){ // PEQUENO AVISO PARA O JOGADOR CASO DIGITE MAIS DE UMA LETRA
      console.log('Opa amigo(a). É apenas uma letra de cada vez!')
    }

    var jaTem = arrLetrasChutadas.join([separador= '']).match(letra);
    var pesquisa = palavra.match(letra);

    while(pesquisa != null){ // LOOP PARA ENCONTRAR AS LETRAS NA PALAVRA
      letraTemp = palavra.search(letra);
      arrExibicao.splice(letraTemp, 1, letra);
      letraTemp = letraTemp = letra;
      palavra = palavra.replace(letra, '0');
      pesquisa = palavra.match(letra);
      acertou = true;
    }

    if(acertou){ // VERIFICAÇÕES PARA CONTROLE DE VIDA
      acertou = false;
    }else if(acertou == false && jaTem != null){
      acertou = false;
    }else if(letra.length == 1 && acertou == false){
      vidas --;
    }

    if(jaTem == null && letra.length == 1){ // VERIFICAÇÃO PARA ADIÇÃO DE LETRA CHUTADA
      arrLetrasChutadas.push(letra);
    }
  }

  buscarEstado(){ // VERIFICAÇÕES DE ESTADO
    var pesquisa = arrExibicao.join([separador= '']).match('_');
    if(vidas == 0){
      estado = 'perdeu';
    }else if(pesquisa == null && vidas > 0){
      estado = 'ganhou';
    }else{
      estado = 'aguardando chute';
    }

    return estado;
  } // POSSIVEIS VALORES: "perdeu", "aguardando chute" ou "ganhou"

  buscarDadosDoJogo(){ 
      return {
          letrasChutadas: arrLetrasChutadas.join().toUpperCase(), // CONTEM TODAS AS LETRAS CHUTADAS
          vidas: vidas, // QUANTIDADE DE VIDAS RESTANTES
          palavra: arrExibicao.join([separador= '']).toUpperCase() // ARRAY COM LETRAS CERTAS OU _ PARA NÃO DESCOBERTAS
      }    
  }
}

module.exports = Forca;