"use strict";

// Запросы
function createRequest(requestBodyString, requestSourceString = "", callback, uploadInfoIsNeed = false) {

  // Отправим запрос
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "https://jscp-diplom.netoserver.ru/");
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.send(requestBodyString);

  // console.warn(`${requestSourceString} - ПОШЕЛ ЗАПРОС К СЕРВЕРУ!`);

  if (uploadInfoIsNeed) {
    // Генерируется периодически во время отправки на сервер
    xhr.upload.onprogress = function (event) {
      console.log(`Отправка данных... Отправлено ${event.loaded} из ${event.total} байт`);
    };

    xhr.upload.onerror = function () {
      console.log("Произошла ошибка при загрузке данных на сервер!");
    };
  }

  // Этот код сработает после того, как мы получим ответ сервера
  xhr.onload = function () {
    if (xhr.status != 200) {
      // HTTP ошибка? Обработаем ошибку
      alert("Ошибка: " + xhr.status);
      return;
    }

    console.log(`${requestSourceString} - статус запроса: ${xhr.status} (${xhr.statusText})`);
    callback(xhr.response);

  };

  xhr.onerror = function () {
    alert("Запрос не удался");
  };

};

// ****
// Используйте функции-обёртки для предотвращения ошибок, связанных с неудачными попытками записи, отсутствием SessionStorage в браузере и дублированием кода.

// JSON.stringify для преобразования объектов в JSON.
// JSON.parse для преобразования JSON обратно в объект.

//  Записать значение value в sessionStorage c ключом key
function setItem(key, value) {
  try {
    return window.sessionStorage.setItem(key, value);
  } catch (e) {
    console.log(e);
  }
}

//  Прочитать значение в sessionStorage по ключу key
function getItem(key, value) {
  try {
    return window.sessionStorage.getItem(key);
  } catch (e) {
    console.log(e);
  }
}

// Преобразовать value в JSON и записать его в sessionStorage c ключом key
function setJSON(key, value) {
  try {
    const json = JSON.stringify(value); // преобразование объектов в JSON

    setItem(key, json);
  } catch (e) {
    console.error(e);
  }
}

// Получить и преобразовать из JSON в объект значение из sessionStorage по ключу key
function getJSON(key) {
  try {
    const json = getItem(key);

    return JSON.parse(json); // преобразование JSON обратно в объект
  } catch (e) {
    console.error(e);
  }
}