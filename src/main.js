import "./css/index.css"
import IMask from "imask"

//Forma de selecionar oq quero dentro do meu código 
const ccBgColor01 = document.querySelector(".cc-bg svg > g g:nth-child(1) path")
const ccBgColor02 = document.querySelector(".cc-bg svg > g g:nth-child(2) path")
const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img")

function setCardType(type){
  
  //Determinando as cores pra cada cartão 
  const colors = {
    visa: ["#436D99", "#2D57F2"],
    mastercard: ["#DF6F29", "#C69347"],
    default: ["black", "gray"],
    AmericanExpress: ["#29D4DF", "#5947C6"],
  }
  
  //Substituindo o atributo de cor
  ccBgColor01.setAttribute("fill", colors[type][0])
  ccBgColor02.setAttribute("fill", colors[type][1])
  ccLogo.setAttribute("src", `cc-${type}.svg`)
}

globalThis.setCardType = setCardType

//Selecionando o codigo CVC e determinando que só pode digitar 4 números, tudo isso através do IMask
const securityCode = document.querySelector("#security-code")
const securityCodePattern = {
  mask: "0000",
}
const securityCodeMasked = IMask (securityCode, securityCodePattern)  //Coloquei pra receber uma váriavel, caso eu precise usar novamente

const expirationDate = document.querySelector("#expiration-date")//Colocando regras na parte de expiração através do Imask para funcionar da maneira correta
const expirationDatePattern = {
  mask: "MM{/}YY",
  blocks: {
  YY: {
    mask: IMask.MaskedRange,
    from: String(new Date().getFullYear()).slice(2),
    to: String(new Date().getFullYear() + 10).slice(2),
  },
  MM: {
    mask: IMask.MaskedRange,
    from: 1,
    to: 12,
  }
  },
}
const expirationDateMasked = IMask (expirationDate, expirationDatePattern) //Coloquei pra receber uma váriavel, caso eu precise usar novamente

const cardNumber = document.querySelector("#card-number")//Uso novamente do Imask para a regra sobre qual cartão vai reconhecer quando colocar os numeros do cartão 
const cardNumberPattern = {
  mask: [
    {
      mask: "0000 0000 0000 0000",
      regex: /^4\d{0,15}/,
      cardtype: "visa",
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
      cardtype: "mastercard",
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /(^34\d|^37\d)\d{0,14}/,
      cardtype: "AmericanExpress",
    },
    {
      mask: "0000 0000 0000 0000",
      cardtype: "default",
    },
  ],
  dispatch: function (appended, dynamicMasked) {
    //Dispatch é utilizado, pois vai ser ativado todas as vezes que digitarem algo na parte do numero do cartão
    const number = (dynamicMasked.value + appended).replace(/\D/g, "") // função usada para caso seja digitado alguma coisa que não seja um numero, ele vai retornar um espaço em branco
    const foundMask = dynamicMasked.compiledMasks.find(function (item) {
      // função para achar a regra que coloquei para reconhecer o cartão
      return number.match(item.regex)
    })

    return foundMask
  },
}
const cardNumberMasked = IMask(cardNumber, cardNumberPattern);

const addButton = document.querySelector("#add-card")  //Definindo a constante para o botao de adicionar cartao para aparecer o alerta de (cartão adicionado)
addButton.addEventListener("click", () => {
  alert("Cartão adicionado!")
})

document.querySelector("form").addEventListener("submit", (event) => {
  event.preventDefault() //Após selecionar o formulario, fizemos com que ao clicar no botao (submit), iria desativar o reaload do submit 
})

const cardHolder = document.querySelector("#card-holder") //Definindo a constante para o input do nome do titular 
cardHolder.addEventListener("input", () => { //Coloca o listener para quando for acionado o input realizar uma ação
  const ccHolder = document.querySelector(".cc-holder .value")//Define a constante para o input label do cartão generico

  ccHolder.innerText = cardHolder.value.length === 0 ? "FULANO DA SILVA" : cardHolder.value //Para quando escrever o nome mudar nos dois e caso nao tenha sido digitado algum nome, faz com que apareça "FULANO..."
})

//Tudp a seguir segue a mesma lógica do de cima!

securityCodeMasked.on("accept", () => {
   updateSecurityCodeMasked(securityCodeMasked.value);
})

function updateSecurityCodeMasked(code){
  const ccSecurity = document.querySelector(".cc-security .value")

  ccSecurity.innerText = code.length === 0 ? "123" : code
}

cardNumberMasked.on("accept", () => {
  const cardType = cardNumberMasked.masked.currentMask.cardtype;
  setCardType(cardType)
  updateCardNumberMasked(cardNumberMasked.value);
})

function updateCardNumberMasked(number){
  const ccNumber = document.querySelector(".cc-number")

  ccNumber.innerText = number.length === 0 ? "0000 0000 0000 0000" : number
}

expirationDateMasked.on("accept", () => {
  updateExpirationDate(expirationDateMasked.value)
})

function updateExpirationDate(date){
  const ccExpiration = document.querySelector(".cc-extra .value")

  ccExpiration.innerText = date.length === 0 ? "02/32" : date 
}