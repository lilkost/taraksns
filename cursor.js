const cursor = document.getElementById("cursor");
const amount = 10;
const sineDots = Math.floor(amount * 0.1);
const width = 26;
const idleTimeout = 150;
let lastFrame = 0;
let mousePosition = { x: 0, y: 0 };
let dots = [];
let timeoutID;
let idle = false;
let hoverButton;
let hoverTL;

class Dot {
  constructor(index = 0) {
    this.index = index;
    this.anglespeed = 0.05;
    this.x = 0;
    this.y = 0;
    this.scale = 1 - 0.05 * index;
    this.range = width / 2 - (width / 2) * this.scale + 2;
    this.limit = width * 0.75 * this.scale;
    this.element = document.createElement("span");
    TweenMax.set(this.element, { scale: this.scale });
    cursor.appendChild(this.element);
  }

  lock() {
    this.lockX = this.x;
    this.lockY = this.y;
    this.angleX = Math.PI * 3 * Math.random();
    this.angleY = Math.PI * 3 * Math.random();
  }

  draw(delta) {
    if (!idle || this.index <= sineDots) {
      TweenMax.set(this.element, { x: this.x, y: this.y });
    } else {
      this.angleX += this.anglespeed;
      this.angleY += this.anglespeed;
      this.y = this.lockY + Math.sin(this.angleY) * this.range;
      this.x = this.lockX + Math.sin(this.angleX) * this.range;
      TweenMax.set(this.element, { x: this.x, y: this.y });
    }
  }
}

function init() {
  window.addEventListener("mousemove", onMouseMove);
  window.addEventListener("touchmove", onTouchMove);
  // eslint-disable-next-line no-new
  lastFrame += new Date();
  buildDots();
  render();
}

function startIdleTimer() {
  timeoutID = setTimeout(goInactive, idleTimeout);
  idle = false;
}

function resetIdleTimer() {
  clearTimeout(timeoutID);
  startIdleTimer();
}

function goInactive() {
  idle = true;
  for (let dot of dots) {
    dot.lock();
  }
}

function buildDots() {
  for (let i = 0; i < amount; i++) {
    let dot = new Dot(i);
    dots.push(dot);
  }
}

const onMouseMove = (event) => {
  mousePosition.x = event.clientX - width / 3;
  mousePosition.y = event.clientY - width / 3;
  resetIdleTimer();
};

const onTouchMove = () => {
  mousePosition.x = event.touches[0].clientX - width / 3;
  mousePosition.y = event.touches[0].clientY - width / 3;
  resetIdleTimer();
};

const render = (timestamp) => {
  const delta = timestamp - lastFrame;
  positionCursor(delta);
  lastFrame = timestamp;
  requestAnimationFrame(render);
};

const positionCursor = (delta) => {
  let x = mousePosition.x;
  let y = mousePosition.y;
  dots.forEach((dot, index, dots) => {
    let nextDot = dots[index + 1] || dots[0];
    dot.x = x;
    dot.y = y;
    dot.draw(delta);
    if (!idle || index <= sineDots) {
      const dx = (nextDot.x - dot.x) * 0.15;
      const dy = (nextDot.y - dot.y) * 0.15;
      x += dx;
      y += dy;
    }
  });
};  
// https://codepen.io/santoshcodes/pen/MWZwjoj
init();


// bock search 

document.addEventListener('mousemove', function(event) {
    const followBlock = document.querySelector('.cursor-circle');
    
    // Позиция курсора
    const x = event.clientX;
    const y = event.clientY;

    // Получаем размеры блока
    const blockWidth = followBlock.offsetWidth;
    const blockHeight = followBlock.offsetHeight;

    // Устанавливаем позицию блока так, чтобы он был по центру курсора
    followBlock.style.left = `${x - blockWidth / 2}px`;
    followBlock.style.top = `${y - blockHeight / 2}px`;
});


// block ><
const movingBlock = document.querySelector('.cursor-circle');
const targetBlocks = document.querySelectorAll('.tarakan');

function isIntersecting(rect1, rect2) {
    return !(
        rect1.right < rect2.left ||
        rect1.left > rect2.right ||
        rect1.bottom < rect2.top ||
        rect1.top > rect2.bottom
    );
}

function checkIntersection() {
    const movingRect = movingBlock.getBoundingClientRect();

    targetBlocks.forEach(targetBlock => {
        const targetRect = targetBlock.getBoundingClientRect();

        if (isIntersecting(movingRect, targetRect)) {
            targetBlock.style.opacity = '1';
        } else {
            targetBlock.style.opacity = '0';
        }
    });
}

// Проверяем пересечение при загрузке и перемещении блока
document.addEventListener('mousemove', (event) => {
    // Пример перемещения блока с мышью
    movingBlock.style.left = `${event.clientX}px`; // Центрируем по мыши
    movingBlock.style.top = `${event.clientY}px`; // Центрируем по мыши
    checkIntersection();
});