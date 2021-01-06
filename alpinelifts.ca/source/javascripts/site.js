function toggleFilter(classFilter) {
  var body = document.querySelector('body');

  body.classList.toggle(classFilter);
}

function clearGroup(group) {
  var body = document.querySelector('body');
  var els = document.querySelectorAll("[data-group='" + group + "']");

  for (let i = 0; i < els.length; i++) {
    var value = els[i].dataset.value;
    body.classList.remove(value);
  }
}

function saveState(group, classFilter) {
  localStorage.setItem(group, classFilter);
}

function initializeState() {
  for(var i =0; i < localStorage.length; i++){
    toggleFilter(localStorage.getItem(localStorage.key(i)));
  }
}

function attachOnloadHandlers() {
  var buttons = document.querySelectorAll('button');

  for (let i = 0; i < buttons.length; i++) {
    let button = buttons[i];

    button.addEventListener('click', function() {
      group = button.dataset.group;
      classFilter = button.dataset.value;

      clearGroup(group);
      toggleFilter(classFilter);
      saveState(group, classFilter);
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
document.addEventListener("DOMContentLoaded", initializeState);
document.addEventListener("DOMContentLoaded", setRefreshTimeout);
