let tickets = JSON.parse(sessionStorage.getItem(sessionStorage.getItem("data-seance-id")));// устанавливаем информацию
let ticketWrapper = document.getElementsByClassName("ticket__info-wrapper")[0];
ticketWrapper.getElementsByClassName("ticket__details ticket__title")[0].textContent = tickets.currentBuy["data-film-name"];

let ticketChairs = ticketWrapper.getElementsByClassName("ticket__details ticket__chairs")[0];
ticketChairs.textContent = "";
Object.keys(tickets.currentBuy["chair"]).forEach((row,index) => {// ряд и место 1/2, 1/2...
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
ticketWrapper.getElementsByClassName("ticket__details ticket__hall")[0].textContent = tickets.currentBuy["data-hall-name"].substr(tickets.currentBuy["data-hall-name"].length - 1);
ticketWrapper.getElementsByClassName("ticket__details ticket__start")[0].textContent = tickets.currentBuy["data-seance-time"];
ticketWrapper.getElementsByClassName("ticket__details ticket__cost")[0].textContent = tickets.currentBuy["cost"];

document.getElementsByClassName("acceptin-button")[0].addEventListener("mouseenter",function () {// смена указателя при наведении на кнопку
    this.style.cursor = "pointer";
})