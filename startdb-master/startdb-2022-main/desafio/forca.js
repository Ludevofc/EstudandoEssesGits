const readline = require('readline-sync');

var arrPalavras = ['abacaxi', 'banana', 'morango', 'abacate', 'kiwi', 'tomate', 'laranja', 'manga', 'tangerina', 'damasco', 'amarelo', 'verde', 'vermelho', 'preto', 'cinza', 'roxo', 'rosa', 'branco', 'ciano', 'azul'];
var arrExibicao = ['_', '_', '_', '_', '_', '_', '_', '_', '_', '_'];
var arrLetrasChutadas = [];

var estado = 'aguardando chute';
var separador = '';
var vidas = 6;
var letraTemp;
var acertou = false;
var quantidade = arrPalavras.length - 1;
var random = Math.round(Math.random() * quantidade);
var palavra = arrPalavras[random];
var tamanho = palavra.length;

while(arrExibicao.length > tamanho){
  arrExibicao.pop('_');
}

class Forca{
  chutar(letra){
    if(letra.length >= 2){
      console.log('Opa amigo(a). É apenas uma letra de cada vez!')
    }

    var jaTem = arrLetrasChutadas.join([separador= '']).match(letra);
    var pesquisa = palavra.match(letra);
    while(pesquisa != null){
      letraTemp = palavra.search(letra);
      arrExibicao.splice(letraTemp, 1, letra);
      letraTemp = letraTemp = letra;
      palavra = palavra.replace(letra, '0');
      pesquisa = palavra.match(letra);
      acertou = true;
    }

    if(acertou){
      acertou = false;
    }else if(acertou == false && jaTem != null){
      acertou = false;
    }else if(letra.length == 1 && acertou == false){
      vidas --;
    }

    if(jaTem == null && letra.length == 1){
      arrLetrasChutadas.push(letra);
    }
  }

  buscarEstado(){
    var pesquisa = arrExibicao.join([separador= '']).match('_');
    if(vidas == 0){
      estado = 'perdeu';
    }else if(pesquisa == null && vidas > 0){
      estado = 'ganhou';
    }else{
      estado = 'aguardando chute';
    }

    return estado;
  } // Possiveis valores: "perdeu", "aguardando chute" ou "ganhou"

  buscarDadosDoJogo(){ 
      return {
          letrasChutadas: arrLetrasChutadas.join().toUpperCase(), // Deve conter todas as letras chutadas
          vidas: vidas, // Quantidade de vidas restantes
          palavra: arrExibicao.join([separador= '']).toUpperCase() // Deve ser um array com as letras que já foram acertadas ou o valor "_" para as letras não identificadas
      }    
  }
}

module.exports = Forca;