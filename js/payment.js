"use strict";

document.addEventListener("DOMContentLoaded", () => {

  const ticketDetails = getJSON("ticket-details");

  // Наполнение страницы
  // Секция ticket__info-wrapper
  const ticketInfoWrapper = document.querySelector(".ticket__info-wrapper");
  ticketInfoWrapper.innerHTML = "";

  const textHtml = `
      <p class="ticket__info">На фильм: <span class="ticket__details ticket__title">${ticketDetails.filmName}</span></p>
      <p class="ticket__info">Ряд/Место: <span class="ticket__details ticket__chairs">${ticketDetails.strRowPlace}</span></p>
      <p class="ticket__info">В зале: <span class="ticket__details ticket__hall">${ticketDetails.hallNameNumber}</span></p>
      <p class="ticket__info">Начало сеанса: <span class="ticket__details ticket__start">${ticketDetails.seanceTime} - ${ticketDetails.seanceDay}</span></p>
      <p class="ticket__info">Стоимость: <span class="ticket__details ticket__cost">${ticketDetails.totalCost}</span> рублей</p>
      <button class="acceptin-button">Получить код бронирования</button>
      <p class="ticket__hint">После оплаты билет будет доступен в этом окне, а также придёт вам на почту. Покажите QR-код нашему контроллёру у входа в зал.</p>
      <p class="ticket__hint">Приятного просмотра!</p>
    `;
  ticketInfoWrapper.insertAdjacentHTML("beforeend", textHtml);

  // Клик по кнопке "Получить код бронирования"
  const acceptinButton = document.querySelector(".acceptin-button");
  acceptinButton?.addEventListener("click", (event) => {
    // Предполагается, что где-то на этом моменте произошла оплата билета
    // и пора отправить на сервер обновленный конфиг занятых мест в зале

    // В качестве тела POST запроса передайте строку вида event=sale_add&timestamp=${value1}&hallId=${value2}&seanceId=${value3}&hallConfiguration=${value4} Где
    // timestamp - начало сеанса с учетом даты. Значение указывается в секундах. Подробнее про timestemp можно прочитать тут
    // hallId - ID зала
    // seanceId - ID сеанса
    // hallConfiguration - Строка - html разметка которую следует взять со страницы hall.html внутри контейнера с классом conf-step__wrapper(см разметку).

    const hallsConfigurationObj = getJSON("pre-config-halls-paid-seats"); // из JSON в объект
    const hallConfiguration = hallsConfigurationObj[ticketDetails.hallId];
    const requestBodyString = `event=sale_add&timestamp=${ticketDetails.seanceTimeStampInSec}&hallId=${ticketDetails.hallId}&seanceId=${ticketDetails.seanceId}&hallConfiguration=${hallConfiguration}`;

    // Формируем запрос на сервер (Передаем: 1. строка тела запроса, 2. строка с именем источника запроса для инфо в консоли, 3. какая функция будет вызвана после ответа сервера, 4. необходимость вывода данных о загрузке на сервер )
    createRequest(requestBodyString, "PAYMENT", updateHtmlPayment, true);
  });

  function updateHtmlPayment(serverResponse) {
    window.location.href = "ticket.html";
  }
});