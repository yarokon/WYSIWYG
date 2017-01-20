let main = document.querySelector('main');
let textArea = document.getElementById('text-area');

const params = [{
  id: 'fontName',
  icon: 'Sans Serif'
}, {
  id: 'fontSize',
  icon: 'format_size'
}, {
  id: 'bold',
  icon: 'format_bold'
}, {
  id: 'italic',
  icon: 'format_italic'
}, {
  id: 'underline',
  icon: 'format_underlined'
}, {
  id: 'hiliteColor',
  icon: '',
  name: 'input',
  attr: {
    type: 'color'
  }
}, {
  id: 'justifyLeft',
  icon: 'format_align_left'
}, {
  id: 'justifyCenter',
  icon: 'format_align_center'
}, {
  id: 'justifyRight',
  icon: 'format_align_right'
}, {
  id: 'insertOrderedList',
  icon: 'format_list_numbered'
}, {
  id: 'insertUnorderedList',
  icon: 'format_list_bulleted'
}, {
  id: 'outdent',
  icon: 'format_indent_decrease'
}, {
  id: 'indent',
  icon: 'format_indent_increase'
}, {
  id: 'removeFormat',
  icon: 'format_clear'
}];

let controlPanel = document.createElement('div');
controlPanel.id = 'control-panel';

let cmdElemnts = {};

params.forEach(el => {
  let type = el.name || 'button';

  let cmd = document.createElement(type);
  if (el.icon.startsWith('format')) {
    cmd.className = 'material-icons';
  }

  if (el.attr) {
    cmd.setAttribute('type', el.attr.type);
  }

  cmd.id = el.id;
  cmd.textContent = el.icon;

  cmdElemnts[el.id] = cmd;
  controlPanel.append(cmd);
});

main.append(controlPanel);


function addListenerMulti(el, s, fn) {
  s.split(' ').forEach(e => el.addEventListener(e, fn, false));
}

addListenerMulti(textArea, 'click keyup focus', highlight);

function highlight() {
  for (let elem in cmdElemnts) {
    if (isSelectionState(elem)) {
      cmdElemnts[elem].style.background = '#ffc107';
    } else {
      cmdElemnts[elem].style.background = '';
    }
  }
}

function isSelectionState(state) {
  return document.queryCommandState(state);
}

controlPanel.addEventListener('click', (e) => {
  if (e.target === e.currentTarget) return;
  
  transformText(e.target.id);
});

function transformText(style) {
  document.execCommand(style, false, null);
  textArea.focus();
}

document.body.onload = function() {
  textArea.focus();
}

document.getElementById('hiliteColor').oninput = function(e) {
  document.execCommand('hiliteColor', false, e.target.value);
}

