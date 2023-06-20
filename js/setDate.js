let days = Array.from(document.getElementsByClassName("page-nav__day")); // устанавливаем дату в список выше
let date = new Date();
date.setDate(date.getDate() - 1);

days.forEach(element => { // дата на следующие дни
  date.setDate(date.getDate() +1);
  element.children[1].textContent = date.getDate();
  switch(Number(date.getDay())){
    case 1:{
      element.children[0].textContent = "Пн";
      break;
    }
    case 2:{
      element.children[0].textContent = "Вт";
      break;
    }
    case 3:{
      element.children[0].textContent = "Ср";
      break;
    }
    case 4:{
      element.children[0].textContent = "Чт";
      break;
    }
    case 5:{
      element.children[0].textContent = "Пт";
      break;
    }
    case 6:{
      element.children[0].textContent = "Сб";
      element.classList.add("page-nav__day_weekend");
      break;
    }
    case 0:{
      element.children[0].textContent = "Вс";
      element.classList.add("page-nav__day_weekend");
      break;
    }
    default:
      break;
  }
})

let currentDate = new Date();// текущая дата
let selectDay = new Date();// день который выбрали 
let navDay = document.getElementsByClassName("page-nav")[0];
navDay.getElementsByClassName("page-nav__day_chosen")[0].classList.toggle("page-nav__day_chosen");// выключаем выбранный день по умолчанию 
navDay.children[0].classList.toggle("page-nav__day_chosen")// сегодняшний день делаем активным

let pageNavDays = Array.from(document.getElementsByClassName("page-nav__day"));// смена текущей даты
pageNavDays.forEach((e,index) => {
  e.onclick = function () {
    document.getElementsByClassName("page-nav__day_chosen")[0].classList.toggle("page-nav__day_chosen");// выключаем текущий
    e.classList.toggle("page-nav__day_chosen");// ставим выбранный 
    selectDay.setDate(currentDate.getDate()+index);
    setFilms(JSON.parse(localStorage.getItem("info")),selectDay);// функция из udateFilm.js обновляем всю информацию под выбранную дату
  }
})