function updatePresence(tab) {
    if (tab) {
      var url = new URL(tab.url);
      var data = {
        action: "set",
        url: tab.url,
        details: url.hostname,
        state: tab.title,
        smallText: tab.url,
        largeText: tab.title
      };
    } else {
      var data = {
        action: "clear"
      };
    }

    var settings = {
      "async": true,
      "crossDomain": true,
      "url": "http://localhost:3000/",
      "method": "POST",
      "headers": {
        "content-type": "application/json"
      },
      "processData": false,
      "data": JSON.stringify(data)
    }

    $.ajax(settings);
}


var lastCheckedTabId;
var wasFocused;
setInterval(function () { // em um intervalo ...
  chrome.windows.getLastFocused({populate: true}, function (window) { //  obter a última janela em foco
    if (window.focused) { //  se está focado
      if (window.tabs) // e tem guias
        for (let tab of window.tabs) // iterar nas guias
          if (tab.highlighted) { // até encontrarmos o selecionado
            if (tab.id != lastCheckedTabId || !wasFocused) { // se for diferente da guia que obtivemos da última vez ou se o navegador não estava focado na última vez
              updatePresence(tab); // o usuário mudou de guia; atualize nossa presença!
              lastCheckedTabId = tab.id; // lembre-se da guia que encontramos
            }
            break; // pare de iterar nas guias
          }
      wasFocused = true; // lembre-se de que uma janela estava focada na última verificação
    } else { // não está focado; o usuário não está olhando para o chrome
      if (wasFocused) { // if it was focused on the last check
        updatePresence(null); // o usuário parou de olhar para o cromo; limpar a presença.
      }
      wasFocused = false; // lembre-se de que nenhuma janela estava focada na última verificação
    }
  });
}, 1000); // verifique a cada segundo