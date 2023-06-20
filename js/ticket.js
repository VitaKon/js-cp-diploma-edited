"use strict";

document.addEventListener("DOMContentLoaded", () => {

  const ticketDetails = getJSON("ticket-details");

  // Секция ticket__info-wrapper
  const ticketInfoWrapper = document.querySelector(".ticket__info-wrapper");
  ticketInfoWrapper.innerHTML = "";

  const textHtml = `
    <p class="ticket__info">На фильм: <span class="ticket__details ticket__title">${ticketDetails.filmName}</span></p>
    <p class="ticket__info">Ряд/Место: <span class="ticket__details ticket__chairs">${ticketDetails.strRowPlace}</span></p>
    <p class="ticket__info">В зале: <span class="ticket__details ticket__hall">${ticketDetails.hallNameNumber}</span></p>
    <p class="ticket__info">Начало сеанса: <span class="ticket__details ticket__start">${ticketDetails.seanceTime} - ${ticketDetails.seanceDay}</span></p>

    <div id="qrcode" class="ticket__info-qr"></div>

    <p class="ticket__hint">Покажите QR-код нашему контроллеру для подтверждения бронирования.</p>
    <p class="ticket__hint">Приятного просмотра!</p>
   `;

  ticketInfoWrapper.insertAdjacentHTML("beforeend", textHtml);

  // QR-код. Функционал находится в файле js/QRCreator.js.
  // Источник: https://github.com/slesareva-gala/QR-Code
  const qrText = `
    Фильм: ${ticketDetails.filmName}
    Зал: ${ticketDetails.hallNameNumber}
    Ряд/место: ${ticketDetails.strRowPlace}
    Дата: ${ticketDetails.seanceDay}
    Начало сеанса: ${ticketDetails.seanceTime}

    Билет действителен строго на свой сеанс
    `;

  const qrcode1 = QRCreator(qrText, {
    mode: 4,
    eccl: 0,
    version: -1,
    mask: -1,
    image: "png",
    modsize: 3,
    margin: 4,
  });

  const content = (qrcode) => {
    return qrcode.error
      ? `недопустимые исходные данные ${qrcode.error}`
      : qrcode.result;
  };

  document.getElementById("qrcode").append("", content(qrcode1));
});
