const editor = document.getElementById('editor');
const toolbar = document.getElementById('toolbar');

/***********/
function addListenerMulti(el, s, fn) {
  s.split(' ').forEach(e => el.addEventListener(e, fn, false));
}

addListenerMulti(editor, 'input keyup mouseup', highlight);

function highlight() {
  const links = toolbar.children;

  for (let i = 0; i < links.length; i++) {
    const link = links[i];

    if (link.tagName === 'A') {
      if (document.queryCommandState(link.dataset.command)) {
        link.style.background = '#f90';
      } else {
        link.style.background = '';
      }
    }
  }
}

/**************************************************/

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
    icons[i].addEventListener('focus', () => {
        editor.focus();
    });
  }
}

addFocusOnEditor(toolbar.children);

/**************************************************/

class Selection {
  constructor(editor) {
    editor.onblur = () => {
      this.saveSelection();
    }

    editor.onfocus = () => {
      this.restoreSelection();
    }
  }

  saveSelection() {
    const sel = window.getSelection();
    this.range = sel.getRangeAt(0);
  }

  restoreSelection() {
    if (this.range) {
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(this.range);
    }
  }
}

new Selection(editor);

/**************************************************/

class Picker {
  constructor(options) {
    Object.assign(this, options);
  }

  getElem() {
    if (!this.container) {
      this.render();
    }

    return this.container;
  }

  renderContainer() {
    this.container = document.createElement('div');
    this.container.className = 'wrapper';

    this.icon = document.createElement('i');
    this.icon.textContent = this.iconStyle;

    if (this.iconStyle) {
      this.icon.className = 'material-icons';
    }

    this.container.append(this.icon);
  }

  render() {
    this.renderContainer();
    this.renderContent()
    this.container.append(this.content);

    this.container.addEventListener('click', (e) => {
      const target = e.target;

      if (target.tagName === 'A') {
        document.execCommand(this.commandName, false, target.dataset.value);
      }

      e.preventDefault();
    });
  }
}

/**************************************************/

class ColorPicker extends Picker {
  constructor(options) {
    super(options);
  }

  renderContent() {
    const colorPalette = ['red', 'cyan', 'blue', 'lime','magenta', 'yellow', 'black', 'white'];

    this.content = document.createElement('div');
    this.content.className = 'palette';

    for (let i = 0; i < colorPalette.length; i++) {
      const a = document.createElement('a');

      a.href = '#';
      a.setAttribute('data-value', colorPalette[i]);
      a.className = 'palette-item';
      a.style.background = colorPalette[i];

      this.content.append(a);
    }

    addFocusOnEditor(this.content.children);
  }
}

/**************************************************/

class SizePicker extends Picker{
  constructor(options) {
    super(options);
  }

  renderContent() {
    this.content = document.createElement('div');
    this.content.className = 'size-board';

    const fontSizes = [{
      size: 1,
      name: 'small'
    }, {
      size: 3,
      name: 'normal'
    }, {
      size: 5,
      name: 'big'
    }, {
      size: 6,
      name: 'huge'
    }];

    for (let i = 0; i < fontSizes.length; i++) {
      const a = document.createElement('a');

      a.href = '#';
      a.setAttribute('data-value', fontSizes[i].size);
      a.className = 'fontSize-item';
      a.textContent = fontSizes[i].name;

      this.content.append(a);
    }

  }

}

class FontPicker extends Picker {
  constructor(options) {
    super(options);
  }

  renderContent() {
    this.content = document.createElement('div');
    this.content.className = 'size-board';

    const fonts = ['Sans Serif', 'Georgia', 'Tahoma', 'Verdana'];
    this.icon.replaceWith(fonts[0]);

    for (let i = 0; i < fonts.length; i++) {
      const a = document.createElement('a');

      a.href = '#';
      a.setAttribute('data-value', fonts[i]);
      a.className = 'fontSize-item';
      a.textContent = fonts[i];
      this.content.append(a);
    }
  }

  render() {
    super.render();

    this.container.addEventListener('click', (e) => {
      const target = e.target;

      if (target.tagName === 'A') {
        this.container.firstChild.replaceWith(target.dataset.value);
      }

      e.preventDefault();
    });
  }
}

const fontButtons = [];

fontButtons.push(new FontPicker({
  commandName: 'fontName',
}).getElem());

fontButtons.push(new SizePicker({
  commandName: 'fontSize',
  iconStyle: 'format_size'
}).getElem());


toolbar.prepend(...fontButtons);

/**************************************************/

const colorButtons = [];

colorButtons.push(new ColorPicker({
  commandName: 'foreColor',
  iconStyle: 'format_color_text'
}).getElem());

colorButtons.push(new ColorPicker({
  commandName: 'backColor',
  iconStyle: 'format_color_fill'
}).getElem());

toolbar.children[4].after(...colorButtons);

/**************************************************/

toolbar.addEventListener('click', (e) => {

  const target = e.target;

  if (target === e.currentTarget || target.closest('.wrapper')) return;

  const command = target.dataset.command;

  document.execCommand(command, false, null);
  editor.normalize();

  e.preventDefault();
});


/**************************************************/

editor.ondrop = function(e) {
  e.preventDefault();
  editor.focus();
  let file = e.dataTransfer.files[0];

  if (file && /image/.test(file.type))  {
    insertImageFile(file);
  }
}


editor.onpaste = function(e) {
  e.preventDefault();

  const items = e.clipboardData.items;
  const item = items[items.length - 1];

  if (/image/.test(item.type)) {
    const file = item.getAsFile();
    insertImageFile(file);
  } else if (/text/.test(item.type)) {
    item.getAsString(data => {
      document.execCommand('insertHTML', false, data);
    });
  }
};

function insertImageFile(file) {
  let reader = new FileReader();

  reader.onload = function(e) {
    document.execCommand('insertImage', false, e.target.result);
    let img = editor.querySelector('img')
    document.execCommand('enableObjectResizing', false, img);
  };

  reader.readAsDataURL(file);
}