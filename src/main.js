//const { invoke } = window.__TAURI__.core;

// let greetInputEl;
// let greetMsgEl;
//
// async function greet() {
//   // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
//   greetMsgEl.textContent = await invoke("greet", { name: greetInputEl.value });
// }
// 初始化 keyboardState
const keyboardState = {
  keys: []
};

const uiState = {
  layer: 0,
  mode: 0,
  activation_value: 0,
  trigger_value: 0,
  reset_value: 0,
  lower_deadzone: 0,
  mousedown: false,
};

// 从 JSON 文件加载键盘布局
async function loadKeyboardLayout() {
  try {
    const response = await fetch('keyboard-layout.json'); // 使用文件的正确路径
    if (!response.ok) {
      throw new Error(`Failed to load keyboard layout: ${response.statusText}`);
    }

    const keyboardLayoutData = await response.json();
    InitializeKeyboardLayout(keyboardLayoutData);
    // renderKeyboard(keyboardLayoutData); // 加载完成后渲染键盘
  } catch (error) {
    console.error('Error loading keyboard layout:', error);
  }
}
function InitializeKeyboardLayout(keyboardLayoutData) {
  const keyboardLayout = document.getElementById('keyboard-layout');
  keyboardLayout.innerHTML = ''; // 清空当前布局


  let width_scale = 1;
  let index = 0;
// 将键盘布局数据加载到 keyboardState 中
  keyboardLayoutData.forEach(row => {
    const rowDiv = document.createElement('div'); // 创建每行的 div 容器
    rowDiv.style.whiteSpace = 'nowrap';
    rowDiv.style.textAlign = 'center';
    row.forEach(item => {
      if (typeof item === 'object' && (item.w || item.a)) {
        // 对于宽度调整项，只修改最后一个按键的宽度
        if (item.w) {
          width_scale = item.w;
        }
      } else {
        // 添加新按键
        const key = {
          index: index,
          label: item, // 按键显示的字符
          selected: false,
          size: [50*width_scale, 50], // 初始大小，宽度会根据 'w' 值调整
          mode: 0,
          value: [0, 0, 0, 0],
          bind_key: [0, 0],
        };
        keyboardState.keys.push(key);
        width_scale = 1;
        index++;
        const keyButton = createKeyboardButton(key); // 创建按键按钮
        rowDiv.appendChild(keyButton); // 将按键按钮添加到当前行
      }
    });

    // 将当前行添加到键盘布局中
    keyboardLayout.appendChild(rowDiv);
  });

// 检查初始化是否成功
  console.log(keyboardState);
}


// 创建按键按钮的函数
function createKeyboardButton(key) {
  const keycapBorder = document.createElement('div');
  keycapBorder.classList.add('keycap-border');

  // 处理键的宽度
  const width = key.size[0];
  const height = key.size[1];
  keycapBorder.style.width = `${width}px`; // 添加单位 'px'
  keycapBorder.style.height = `${height}px`; // 添加单位 'px'

  const keyButton = document.createElement('div');
  keyButton.classList.add('keybutton');
  keyButton.setAttribute('data-index', key.index);

  const index = key.index;
  keyButton.addEventListener('mousedown', () => onKeyClick(index));
  keyButton.addEventListener('mouseenter', () => onMouseEnter(index));
  keyButton.addEventListener('dragenter', (event) => onDragEnter(event, index));
  keyButton.addEventListener('dragleave', (event) => onDragLeave(event, index));
  keyButton.addEventListener('dragover', (event) => event.preventDefault());
  keyButton.addEventListener('drop', (event) => onDrop(event, index));

  // 设置按键显示的字符
  keyButton.innerText = key.label // 取字符串的第一行作为显示字符

  keycapBorder.appendChild(keyButton);
  return keycapBorder;
}

// Function to handle key click
function onKeyClick(index) {
  let key = keyboardState.keys.at(index);
  key.selected = !key.selected;
  // 只更新相应的键按钮
  const keyButton = document.querySelector(`.keybutton[data-index="${index}"]`);
  if (keyButton) {
    if (key.selected) {
      keyButton.classList.add('active');
    } else {
      keyButton.classList.remove('active');
    }
  }
  console.log(keyboardState.keys[index])

}

// Function to handle mouse enter event
function onMouseEnter(index) {
  if (uiState.mousedown) {
    onKeyClick(index);
  }
}

// Function to handle drag enter event
function onDragEnter(event, index) {
  event.preventDefault();
  keyboardState.keys[index].selected = true;
}

// Function to handle drag leave event
function onDragLeave(event, index) {
  event.preventDefault();
  keyboardState.keys[index].selected = false;
}

// Function to handle drop event
function onDrop(event, index) {
  event.preventDefault();
  const keycode = parseInt(event.dataTransfer.getData('keycode'), 10);
  if (!isNaN(keycode)) {
    keyboardState.keys.forEach(key => {
      if (key.selected) {
        key.bind_key[uiState.layer] = keycode;
        key.selected = false;
      }
    });
  }
}


window.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded and parsed");

  // greetInputEl = document.querySelector("#greet-input");
  // greetMsgEl = document.querySelector("#greet-msg");
  // document.querySelector("#greet-form").addEventListener("submit", (e) => {
  //   e.preventDefault();
  //   greet();
  // });



  loadKeyboardLayout().then(_r => {})
});