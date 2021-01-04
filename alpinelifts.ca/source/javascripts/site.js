// This is where it all goes :)
function toggleFilter(classFilter) {
  var table = document.querySelector('table');

  table.classList.toggle(classFilter);
}

function clearGroup(group) {
  var table = document.querySelector('table');
  var els = document.querySelectorAll("[data-group='" + group + "']");

  for (let i = 0; i < els.length; i++) {
    var value = els[i].dataset.value;
    table.classList.remove(value);
  }
}

function attachOnloadHandlers() {
  var buttons = document.querySelectorAll('table button');

  for (let i = 0; i < buttons.length; i++) {
    let button = buttons[i];

    button.addEventListener('click', function() {
      group = button.dataset.group;
      classFilter = button.dataset.value;

      clearGroup(group);
      toggleFilter(classFilter);
    })
  }
}

document.addEventListener("DOMContentLoaded", attachOnloadHandlers);
