let wrap = document.getElementsByClassName("ticket__info-wrapper")[0];// контейнер с информацией

let tickets = JSON.parse(sessionStorage.getItem(sessionStorage.getItem("data-seance-id")));
wrap.getElementsByClassName("ticket__details ticket__title")[0].textContent = tickets.currentBuy["data-film-name"];//имя фильма

let ticketChairs = wrap.getElementsByClassName("ticket__details ticket__chairs")[0]; // ряд место
ticketChairs.textContent = "";
Object.keys(tickets.currentBuy["chair"]).forEach((row,index) => {
    tickets.currentBuy["chair"][row].forEach((place,index) => {
        ticketChairs.textContent += `${row}/${place}`;
        if(tickets.currentBuy["chair"][row].length - 1 > index){
            ticketChairs.textContent += ", ";
        }  
    })
    if(Object.keys(tickets.currentBuy["chair"]).length - 1 > index){
        ticketChairs.textContent += ", ";
    }
})
wrap.getElementsByClassName("ticket__details ticket__hall")[0].textContent = tickets.currentBuy["data-hall-name"].substr(tickets.currentBuy["data-hall-name"].length - 1);// номер зала
wrap.getElementsByClassName("ticket__details ticket__start")[0].textContent = tickets.currentBuy["data-seance-time"]; //начало сеанса

// Получаем элемент по индексу
let childElement = wrap.children[3]; // после 3 элемента вставляем qr(0,1,2,3,qr...)

let div = document.createElement("div"); // блок для qr кода

document.getElementsByClassName("ticket__info-qr")[0].remove(); // удаляем стандартный qr;

let textQr = `Фильм: ${tickets.currentBuy["data-film-name"]}\nРяд/Место: ${ticketChairs.textContent}\nЗал: ${tickets.currentBuy["data-hall-name"].substr(tickets.currentBuy["data-hall-name"].length - 1)}\nНачало: ${tickets.currentBuy["data-seance-time"]}`;
JSON.stringify(textQr);
// добавляем свой
let qr = QRCreator(textQr,
{ mode: 4,
  eccl: 0,
  version: 8,
  mask: 3,
  image: 'png',
  modsize: 4,
  margin: 0
});
const content = (qrcode) =>{
  return qrcode.error ?
    `недопустимые исходные данные ${qrcode.error}`:
    qrcode.result;
};
div.classList.add("ticket__info-qr");
let qrCanvas = content(qr);
qrCanvas.style.padding = "5px";
qrCanvas.style.background = "white";
div.appendChild(qrCanvas);// заносим qr в div
wrap.insertBefore(div, childElement.nextSibling);// после 3 элемента вставляем блок div с qr