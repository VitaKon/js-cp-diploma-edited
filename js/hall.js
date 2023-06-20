"use strict";

document.addEventListener("DOMContentLoaded", () => {
  // Получение актуальной схемы посадочных мест на выбранный сеанс с учетом уже купленных билетов.
  // В качестве тела POST запроса передайте строку вида event=get_hallConfig&timestamp=${value1}&hallId=${value2}&seanceId=${value3} Где

  // timestamp - начало сеанса с учетом даты Значение указывается в секундах
  // hallId - ID зала
  // seanceId - ID сеанса

  // Результат
  // Строка - html разметка которую следует поместить на странице hall.html внутри контейнера с классом conf-step__wrapper(см разметку

  // Попытка получить данные сеанса...
  const dataOfTheSelectedSeance = getJSON("data-of-the-selected-seance");

  const timestamp = +dataOfTheSelectedSeance.seanceTimeStamp / 1000;
  const hallId = dataOfTheSelectedSeance.hallId;
  const seanceId = dataOfTheSelectedSeance.seanceId;
  const requestBodyString = `event=get_hallConfig&timestamp=${timestamp}&hallId=${hallId}&seanceId=${seanceId}`;

  // Формируем запрос на сервер (Передаем: 1. строка тела запроса, 2. строка с именем источника запроса для инфо в консоли, 3. какая функция будет вызвана после ответа сервера )
  createRequest(requestBodyString, "HALL", updateHtmlHall);
});

function updateHtmlHall(serverResponse) {
  const response = JSON.parse(serverResponse); // объект

  // Попытка получить данные сеанса...
  const dataOfTheSelectedSeance = getJSON("data-of-the-selected-seance");

  // Евгений Варламов — 20.04.2023 22:01
  // При get_hallConfig  сервер может возвращать null
  // Если сервер возвращает  null  это значит что в базе не нашлось ни одного проданного билета на данный сеанс.
  // И следовательно конфигурацию зала следует брать из массива halls который вы получаете при команде update
  let configSelectedHall;
  let configHalls = getJSON("config-halls"); // получить и преобразовать из JSON в объект
  if (response !== null) {
    console.info("Есть данные в ответе сервера по залу...");
    configSelectedHall = response; // приходит один зал  виде строки разметки
  } else {
    console.info("В зале нет купленных мест...");
    configSelectedHall = configHalls[dataOfTheSelectedSeance.hallId];
  }

  const buyingInfoSection = document.querySelector(".buying__info");
  buyingInfoSection.innerHTML = "";

  const textHtml = `
  <div class="buying__info-description">
    <h2 class="buying__info-title">"${dataOfTheSelectedSeance.filmName}"</h2>
    <p class="buying__info-start">Начало сеанса: ${dataOfTheSelectedSeance.seanceTime
    } </br>
    ${new Date(+dataOfTheSelectedSeance.seanceTimeStamp).toLocaleDateString(
      "ru-RU",
      { day: "2-digit", month: "long", year: "numeric" }
    )}</p>
    <p class="buying__info-hall">${dataOfTheSelectedSeance.hallName
    }</p>          
  </div>
  <div class="buying__info-hint">
    <p>Тапните дважды,<br>чтобы увеличить</p>
  </div>
`;
  buyingInfoSection.insertAdjacentHTML("beforeend", textHtml);

  // Секция со схемой зала
  // заполняется или из ответа сервера в виде строки-html для выбранного зала, или вытягивается из конфы первого запроса, если нет купленных мест и пришел ответ null
  const confStep = document.querySelector(".conf-step");
  const textHtmlConf = `
  <div class="conf-step__wrapper">
  ${configSelectedHall}
  </div>
`;

  confStep.innerHTML = "";
  confStep.insertAdjacentHTML("beforeend", textHtmlConf);

  const textHtmlLegend = `
    <div class="conf-step__legend">
    <div class="col">
      <p class="conf-step__legend-price"><span class="conf-step__chair conf-step__chair_standart"></span> Свободно (<span
          class="conf-step__legend-value price-standart">${dataOfTheSelectedSeance.priceStandart}</span>руб)</p>
      <p class="conf-step__legend-price"><span class="conf-step__chair conf-step__chair_vip"></span> Свободно VIP (<span
          class="conf-step__legend-value price-vip">${dataOfTheSelectedSeance.priceVip}</span>руб)</p>
    </div>
    <div class="col">
      <p class="conf-step__legend-price"><span class="conf-step__chair conf-step__chair_taken"></span> Занято</p>
      <p class="conf-step__legend-price"><span class="conf-step__chair conf-step__chair_selected"></span> Выбрано</p>
    </div>
  </div>
`;
  confStep.insertAdjacentHTML("beforeend", textHtmlLegend);

  const selectedChairs = [];

  // Клик по месту на схеме зала
  const confStepChair = document.querySelectorAll(
    ".conf-step__wrapper .conf-step__chair"
  );

  confStepChair.forEach((element) => {
    element.addEventListener("click", (event) => {
      // currentTarget — указывает на элемент, на котором установлен обработчик события.
      const elementClickClassList = event.currentTarget.classList;
      if (
        elementClickClassList.contains("conf-step__chair_disabled") ||
        elementClickClassList.contains("conf-step__chair_taken")
      ) {
        return;
      }
      element.classList.toggle("conf-step__chair_selected");
    });
  });

  // Клик по кнопке "Забронировать"
  const acceptinButton = document.querySelector(".acceptin-button");

  acceptinButton?.addEventListener("click", (event) => {
    event.preventDefault();
    // 1. Формируем список выбранных мест selectedChairs
    // 2. Меняем статус выбранных мест с "выбранные" на "занятые"
    // 3. Сохраняем новую кофигурацию зала ("pre-config-halls") в новом объекте Хранилища
    // 4. На следующей стринице "после оплаты" - отправляем на сервер измененную схему зала
    const arrayOfRows = Array.from(
      document.querySelectorAll(".conf-step__row")
    );

    for (let indexRow = 0; indexRow < arrayOfRows.length; indexRow++) {
      const elementRow = arrayOfRows[indexRow];
      const arrayOfChairs = Array.from(
        elementRow.querySelectorAll(".conf-step__chair")
      );

      for (
        let indexChair = 0;
        indexChair < arrayOfChairs.length;
        indexChair++
      ) {
        const elementChair = arrayOfChairs[indexChair];
        if (elementChair.classList.contains("conf-step__chair_selected")) {
          const typeChair = elementChair.classList.contains(
            "conf-step__chair_vip"
          )
            ? "vip"
            : "standart";

          selectedChairs.push({
            row: indexRow + 1,
            place: indexChair + 1,
            typeChair: typeChair,
          });
        }
      }
    }

    // Если есть выбранные места в зале
    if (selectedChairs.length) {
      // Запишем в хранилище выбранные места в зале
      setJSON("data-of-the-selected-chairs", selectedChairs);

      // Конфигурация (разметка) выбранного зала
      const configSelectedHallHtml = document
        .querySelector(".conf-step__wrapper")
        ?.innerHTML.trim();

      // Запишем выбранные места в конфиг залов в Хранилище
      configHalls[dataOfTheSelectedSeance.hallId] = configSelectedHallHtml;
      setJSON("config-halls", configHalls);

      // Подготовим пре-конфигурацию залов с "занятыми" (оплаченными) местами
      confStepChair.forEach((element) => {
        element.classList.replace("conf-step__chair_selected", "conf-step__chair_taken");
      });

      const configSelectedHallTaken = document.querySelector(".conf-step__wrapper")?.innerHTML.trim();
      const configHallsTaken = getJSON("config-halls");

      // Запишем занятые места в отдельный пре-конфиг залов в Хранилище, после оплаты он отправится на сервер (отдельный, чтобы при нажатии кнопки "Назад" не показываались места "taken", т.к. они еще не оплачены)
      configHallsTaken[dataOfTheSelectedSeance.hallId] = configSelectedHallTaken;
      setJSON("pre-config-halls-paid-seats", configHallsTaken);

      // Сформируем набор итоговых данных для заполнения билета на следующих страницах
      const dataOfTheSelectedChairs = getJSON("data-of-the-selected-chairs");

      // Считаем общую стоимость билетов и формируем строку выбранных мест
      const arrRowPlace = [];
      let totalCost = 0;

      dataOfTheSelectedChairs.forEach(element => {
        arrRowPlace.push(`${element.row}/${element.place}`);
        totalCost += element.typeChair === "vip" ? +dataOfTheSelectedSeance.priceVip : +dataOfTheSelectedSeance.priceStandart;
      });

      const strRowPlace = arrRowPlace.join(", ");

      const ticketDetails = {
        ...dataOfTheSelectedSeance,
        strRowPlace: strRowPlace,
        hallNameNumber: dataOfTheSelectedSeance.hallName.slice(3).trim(),
        seanceTimeStampInSec: +dataOfTheSelectedSeance.seanceTimeStamp / 1000,
        seanceDay: new Date(+dataOfTheSelectedSeance.seanceTimeStamp).toLocaleDateString("ru-RU", { day: "2-digit", month: "short", year: "numeric" }),
        totalCost: totalCost,
      };

      setJSON("ticket-details", ticketDetails);

      window.location.href = "payment.html";
    }
  });
};
