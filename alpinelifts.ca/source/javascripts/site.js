function reinitState() {
  var body = document.querySelector('body');
  body.removeAttribute('class');
  var queryParams = new URLSearchParams(location.search);

  queryParams.forEach(function(classFilter, _group) {
    body.classList.add(classFilter);

    document.querySelectorAll("button[data-value='" + classFilter + "']").forEach(function(button) {
      button.classList.add('active');
    });
  });
}

function deselectOthersInGroup(group, classFilter) {
  const els = document.querySelectorAll("button[data-group='" + group + "']:not([data-value='" + classFilter + "'])");
  els.forEach(function(button) {
    button.removeAttribute('class');
  });
}

function updateURL() {
  var queryParams = new URLSearchParams();
  const buttons = document.querySelectorAll('button.active');

  buttons.forEach(function(button) {
    var group = button.dataset.group;
    var classFilter = button.dataset.value;
    queryParams.set(group, classFilter);
  });

  history.replaceState({}, Document.title, '?' + queryParams.toString());
}

function attachOnloadHandlers() {
  var buttons = document.querySelectorAll('button');

  for (let i = 0; i < buttons.length; i++) {
    let button = buttons[i];

    button.addEventListener('click', function() {
      var group = button.dataset.group;
      var classFilter = button.dataset.value;
      this.classList.toggle('active');
      deselectOthersInGroup(group, classFilter)
      updateURL();
      reinitState();
    })
  }
}

function setRefreshTimeout() {
  setInterval(function() {
    fetch('/index.html').then(function(response) {
      return response.text();
    }).then(function(html) {
      var parser = new DOMParser();
      var doc = parser.parseFromString(html, 'text/html');
      var newTable = doc.querySelector('table');
      document.querySelector('table').innerHTML = newTable.innerHTML;
      console.log("Reloaded.");
    }).catch(function(err) {
      console.warn("An error occurred.", err);
    })
  }, 60 * 1000)
}

document.addEventListener("DOMContentLoaded", attachOnloadHandlers);
document.addEventListener("DOMContentLoaded", reinitState);
document.addEventListener("DOMContentLoaded", setRefreshTimeout);
