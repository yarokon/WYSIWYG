const editor = document.getElementById('editor');
const toolbar = document.getElementById('toolbar');

/******************************/

function addMaterialClass (icons) {
  for (let i = 0; i < icons.length; i++) {

    const icon = icons[i];

    if (icon.textContent.startsWith('format')) {
      icon.className = 'material-icons';
    }
  }
}

addMaterialClass(toolbar.children);

function addFocusOnEditor(icons) {
  for (let i = 0; i < icons.length; i++) {
    icons[i].addEventListener('focus', () => editor.focus());
  }
}

addFocusOnEditor(toolbar.children);

/******************************/

let range;

editor.onblur = function() {
  range = saveSelection();
}

editor.onfocus = function() {
  restoreSelection(range);
}

function saveSelection() {
  const sel = window.getSelection();
  return sel.getRangeAt(0);
}

function restoreSelection(range) {
  if (range) {
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  }
}

/******************************/

let foreWrapper = toolbar.querySelector('.fore-wrapper');
let backWrapper = toolbar.querySelector('.back-wrapper');

toolbar.addEventListener('click', (e) => {
  const target = e.target;

  if (target === e.currentTarget) return;

  const command = target.dataset.command;

  if (target.closest('.fore-wrapper')) {
    document.execCommand('foreColor', false, foreWrapper.dataset.value);
    console.log(1);
  }

  if (target.closest('.back-wrapper')) {
    document.execCommand('backColor', false, backWrapper.dataset.value);
    console.log(2);
  }

  if (command === 'foreColor') {
    const currentColor = target.dataset.value;
    foreWrapper.setAttribute('data-value', currentColor);
    document.execCommand('foreColor', false, currentColor);
    foreWrapper.firstElementChild.style.color = currentColor;
    console.log(3);
  } 

  if (command === 'backColor') {
    const currentColor = target.dataset.value;
    backWrapper.setAttribute('data-value', currentColor);
    document.execCommand('backColor', false, currentColor);
    backWrapper.firstElementChild.style.color = currentColor;
    console.log(4);
  } else {
    document.execCommand(command, false, null);
    editor.normalize();
    console.log(5);
  }

  e.preventDefault();
});


/******************************/

const colorPalette = ['#000', '#f96', '#69f', '#9f6','#c00', '#0c0', '#00c', '#333', '#06f', '#fff'];

const forePalette = document.querySelector('.fore-palette');

for (let i = 0; i < colorPalette.length; i++) {
  let a = document.createElement('a');

  a.href = '#';
  a.setAttribute('data-command', 'foreColor');
  a.setAttribute('data-value', colorPalette[i]);
  a.style.background = colorPalette[i];
  a.className = 'palette-item';

  forePalette.append(a);
}

addFocusOnEditor(forePalette.children);


const backPalette = document.querySelector('.back-palette');

for (let i = 0; i < colorPalette.length; i++) {
  let a = document.createElement('a');

  a.href = '#';
  a.setAttribute('data-command', 'backColor');
  a.setAttribute('data-value', colorPalette[i]);
  a.style.background = colorPalette[i];
  a.className = 'palette-item';

  backPalette.append(a);
}

addFocusOnEditor(backPalette.children);
