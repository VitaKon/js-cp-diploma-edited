function request(callback,data) {
    let url = "https://jscp-diplom.netoserver.ru/"; // URL для обращения
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); 
    xhr.onreadystatechange = function() {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          callback(xhr.responseText);
        } 
        else {
          alert("Ошибка: " + xhr.status);
        }
      }
    };

    xhr.onerror = function() {
      alert("Произошла ошибка сети или неправильный URL");
    };

    xhr.send(data);
  }