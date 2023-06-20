function startSetInfo(){
  if (!localStorage.length) {  // если файлов нет , обращаемся на сервер
    request((info) => {
      localStorage.setItem('info', info);// сохранили информацию с сервера
      localStorage.setItem('date',new Date());// записали дату сохранения
      setFilms(JSON.parse(info),selectDay); // устанавливаем фильмы
    },"event=update");
 }
 else {
   let date = new Date(localStorage.getItem("date"));// получили дату сохранения файлов
   if (currentDate.getDate() === date.getDate()) { // если дата сохранения сегодняшняя , то получаем информацию из локальных файлов. (currentDate из setDate.js)
     let info = JSON.parse(localStorage.getItem("info"));// переводим в объект и устанавливаем фильмы
     setFilms(info,selectDay);
   }else { // делаем запрос т.к. файлы устарели
      request((info) => {
        localStorage.setItem('info', info);// сохранили информацию с сервера
        localStorage.setItem('date',new Date());// записали дату сохранения
        setFilms(JSON.parse(info),selectDay); // устанавливаем фильмы
      },"event=update");
   }
 }
}

function setFilms(info,date) {// принимает информацию которая приходит с сервера 1 запросом либо из localStroage, date - конкретный день и последующие дни , является Date. 
    let moviesSection = Array.from(document.getElementsByClassName("movie"));// получаем все секции с фильмами
    let movieSection = moviesSection[0].cloneNode(true);// создали копию 1 секции
    let seanceHall = Array.from(movieSection.getElementsByClassName("movie-seances__hall"))[0].cloneNode(true); // копия блока сеанса
    moviesSection.forEach(element => { element.remove()}); // Удаляем все блоки
    Array.from(movieSection.getElementsByClassName("movie-seances__hall")).forEach(e => {e.remove()}); // удалили информацию о сеансах
    let main = Array.from(document.getElementsByTagName("main"))[0];// получаем элемент main  в котором лежат секции с фильмами

    let filmsHalls ={}; // объект , ключ - ид фильма, по ключу массив сеансов .
    info.seances.result.forEach(e => {
      filmsHalls[e.seance_filmid] ? filmsHalls[e.seance_filmid].push(e) : filmsHalls[e.seance_filmid] = [e]; 
    })

    let openHalls = {}; // содержит открытые залы. Где ключ - название зала (зал1, зал2 ....)
    info.halls.result.forEach(e=> {// ищем открытые залы
      if(e.hall_open === "1"){
        openHalls[e.hall_id] = e;
      } 
    })

    info.films.result.forEach((element) => { //добавляем секции с новой информацией
      let newMovieSection = movieSection.cloneNode(true);
      let curretnFilmHalls = {};
      Array.from(newMovieSection.getElementsByClassName("movie__poster-image"))[0].src = element.film_poster;
      Array.from(newMovieSection.getElementsByClassName("movie__title"))[0].textContent = element.film_name;
      Array.from(newMovieSection.getElementsByClassName("movie__data-duration"))[0].textContent = element.film_duration + " " + declension(Number(element.film_duration),['минута', 'минуты', 'минут']);
      Array.from(newMovieSection.getElementsByClassName("movie__data-origin"))[0].textContent = element.film_origin;
      Array.from(newMovieSection.getElementsByClassName("movie__synopsis"))[0].textContent = element.film_description;

      filmsHalls[element.film_id].forEach(e => { // зал и время для конкретного фильма
        if(openHalls[e.seance_hallid]){
          let hall = openHalls[e.seance_hallid];
          if(curretnFilmHalls[hall.hall_name]) {
            curretnFilmHalls[hall.hall_name].push(e.seance_time);
          }
          else {
            curretnFilmHalls[hall.hall_name] = [e.seance_time];
          }
        }
      })  // после манипуляций в перменной curretnFilmHalls находится ввиде ключа название зала (зал1), а поключу массив времени сеансов этого зала
      
      let sortedHalls = {}; // сортируем залы по порядку зал 1 , зал 2 ...
      Object.keys(curretnFilmHalls).sort().forEach(key => {
        sortedHalls[key] = curretnFilmHalls[key];
      });

      Object.keys(sortedHalls).forEach(key => { // перебираем все залы и выводим информацию 
        let hall = seanceHall.cloneNode(true);
        let ul = hall.getElementsByTagName("ul")[0];
        let li = ul.getElementsByTagName("li")[0].cloneNode(true);
        ul.innerHTML = "";

        hall.getElementsByTagName('h3')[0].textContent = key.substring(0,3)+" "+key.substring(3);// название Зала(Зал1 разделяем на Зал 1)

        sortedHalls[key].forEach( time => {// перебираем время на конкретного фильма в конкретном зале
          let currHall = Object.values(openHalls).find(hall => hall.hall_name === key) ;// возвращаем текущий зал
          let currSeance = filmsHalls[element.film_id].find( seance=> {return seance.seance_time === time})// получаем текущий сеанс по заданому времени
          let newTime = li.cloneNode(true);
          let refHall =  newTime.children[0]; // тег а , от перечисления

          refHall.classList.remove("acceptin-button-disabled");//удаляем класс отключенной кнопки
          refHall.textContent = time;// Устанавливаем всю необходимую информацию в атрибуты тега а
          refHall.setAttribute('data-film-id', element.film_id);// id фильма
          refHall.setAttribute('data-film-name', element.film_name);// название фильма
          refHall.setAttribute('data-hall-name', key.substring(0,3)+" "+key.substring(3));// Название зала (Зал 1)
          refHall.setAttribute('data-hall-id', currHall.hall_id);// id зала
          refHall.setAttribute('data-price-vip', currHall.hall_price_vip);// цена на вип место
          refHall.setAttribute('data-price-standart', currHall.hall_price_standart);// цена на стандартное место
          refHall.setAttribute('data-seance-id', currSeance.seance_id);// id текущего сеанса (сеанс за который будет отвечать конкретный тег а)
          refHall.setAttribute('data-seance-time', currSeance.seance_time);//время сеанса
          refHall.setAttribute('data-seance-start', currSeance.seance_start);//Время начала сеанса
          refHall.setAttribute('data-seance-timestamp', toSecond(currSeance.seance_time,date));//timestamp

          if(selectDay.getDate() === currentDate.getDate()) {  // выключаем сеансы, которые уже прошли
            let timeSeance = Number(refHall.getAttribute("data-seance-timestamp"));// время сеанса в секундах
            let currentTime = Math.floor(currentDate.getTime()/1000);// текущее время в секундах
            if(timeSeance < currentTime){
              refHall.classList.add("acceptin-button-disabled");
            }
          }

          let data = `event=get_hallConfig&timestamp=${refHall.getAttribute("data-seance-timestamp")}&hallId=${refHall.getAttribute("data-hall-id")}&seanceId=${refHall.getAttribute("data-seance-id")}`;
          refHall.onclick = function(){
            request((hallInfo)=> {
              sessionStorage.setItem("hallInfo",hallInfo);
              sessionStorage.setItem("hall_config",currHall.hall_config);// сохраняем конфиг зала если в hallInfo null

              for (let i = 0; i < refHall.attributes.length; i++) {
                const attribute = refHall.attributes[i];
                sessionStorage.setItem(attribute.name,attribute.value);// сохраняем все атрибуты, которые находятся в теге а, что бы передать их на след. страницу 
              }
              window.location.href = "hall.html";// переходим на след стр 
            },data);
            return false;
          }
          ul.appendChild(newTime);//добавляем новый li
        })
        newMovieSection.appendChild(hall);//добавлям новый зал в секцию с залами для фильма

      })
      main.appendChild(newMovieSection);//добавляем блок с конкретным фильмом
    })
}

function toSecond(time,date) {
  let [hours, minutes] = time.split(':');
  date.setHours(hours);
  date.setMinutes(minutes);
  date.setSeconds(0);
  return Math.floor(date.getTime() / 1000); // округляем в меньшую сторону
}
function declension(number, titles) { // игра слов... минута, минуты и тд
  const cases = [2, 0, 1, 1, 1, 2];
  return titles[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
}

startSetInfo();

setInterval(()=>{ // каждую секунду проверяем сеанс и обновляем текущее время
  currentDate = new Date();
  let acceptinButton = Array.from(document.getElementsByClassName("movie-seances__time"));
  acceptinButton.forEach(e => {
    if(selectDay.getDate() === currentDate.getDate()) {  // выключаем сеансы, которые уже прошли
      let timeSeance = Number(e.getAttribute("data-seance-timestamp"));// время сеанса в секундах
      let currentTime = Math.floor(currentDate.getTime()/1000);// текущее время в секундах
       if(timeSeance < currentTime){
        e.classList.add("acceptin-button-disabled");
       }
       else {
        e.classList.remove("acceptin-button-disabled");//удаляем класс отключенной кнопки
      }
    }
  }) 
},1000)