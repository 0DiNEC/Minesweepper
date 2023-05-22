import {
  buildMainMenu,
  gameFieldSize,
  gameMode,
  buildDefeatMenu,
  buildWinMenu,
  saveTempResult,
  isDark
} from './menu.js';

let countMoves = 0;
let flagsCount;
let flagToWin;

const smileStates = [
  'Assets/img/always.png',
  'Assets/img/click.png',
  'Assets/img/dead.png',
];

let isMouseDown = false;
let isGameOver = false;

function buildFields() {
  const gameField = document.createElement('section');
  gameField.classList = 'game-field';
  document.body.appendChild(gameField);
  const header = document.createElement('div');
  header.classList = 'game-field__header';
  if (isDark)
    header.classList.add('game-field_night');
  gameField.appendChild(header);

  const headerItems = document.createElement('div');
  headerItems.classList = 'header__items';
  header.appendChild(headerItems);

  const moves = document.createElement('div');
  moves.classList = 'moves';
  moves.textContent = '0';
  headerItems.appendChild(moves);

  const sectionInfo = document.createElement('section');
  sectionInfo.classList = 'section-info';
  headerItems.appendChild(sectionInfo);

  const smileButton = document.createElement('button');
  smileButton.classList = 'smile-btn';
  if (isDark) smileButton.classList.add('smile-btn_night');
  smileButton.style.backgroundImage = `url('${smileStates[0]}')`;
  smileButton.addEventListener('click', rebuildGameZone);
  sectionInfo.appendChild(smileButton);

  flagToWin = Math.floor((gameFieldSize * gameFieldSize) / 10);
  const countFlags = document.createElement('div');
  countFlags.classList = 'count-flags';
  countFlags.textContent = flagToWin.toString();
  sectionInfo.appendChild(countFlags);

  const timer = document.createElement('div');
  timer.classList = 'timer';
  timer.textContent = '0';
  headerItems.appendChild(timer);

  let size;
  if (gameFieldSize === gameMode.easyMode) size = 3.2;
  else if (gameFieldSize === gameMode.normalMode) size = 2;
  else size = 1.07;

  const ceils = document.createElement('div');
  ceils.classList = 'game-field__ceils';
  ceils.style.gridTemplateColumns = `repeat(${gameFieldSize}, ${size}rem)`;
  ceils.style.gridAutoRows = `${size}rem`;
  if (isDark)
    ceils.classList.add('game-field_night');
  gameField.appendChild(ceils);

  for (let i = 0; i < gameFieldSize * gameFieldSize; i++) {
    const cell = document.createElement('div');
    cell.classList = `game-field__cell ${i} cell`;
    if (isDark)
      cell.classList.add('game-field-cell_night');

    cell.addEventListener('click', cellClick);
    // eslint-disable-next-line no-loop-func
    cell.addEventListener('contextmenu', (event) => {
      const { target } = event;
      if (!isGameOver) {
        if (!target.classList.contains('__active')) {
          const cellNum = parseInt(target.classList[1], 10);
          if (isFirstCellClick) {
            isFirstCellClick = false;
            putMines(cellNum);
            startTimer();
          }
          target.classList.toggle('flag');
          if (target.classList.contains('flag')) {
            flagsCount--;
            if (mines.includes(cellNum))
              flagToWin--;
            target.classList.remove('game-field__cell');
            target.style.backgroundImage = "url('Assets/img/flag.png')";
            target.style.backgroundRepeat = 'no-repeat';
            target.style.backgroundPosition = 'center';
            target.style.backgroundSize = 'cover';
            if (flagToWin === 0) {
              const victory = new Audio('Assets/sounds/victory.ogg');
              buildWinMenu(seconds, countMoves);
              saveTempResult(seconds, countMoves);
              isGameOver = true;
              stopTimer();
              victory.play();
            }
          } else {
            flagsCount++;
            if (mines.includes(cellNum))
              flagToWin++;
            target.classList.add('game-field__cell');
            target.style.backgroundImage = 'none';
          }
          countFlags.textContent = flagsCount;
        }
      }
    });
    // eslint-disable-next-line no-loop-func
    cell.addEventListener('mousedown', () => {
      if (!cell.classList.contains('__active') && !isGameOver) {
        smileButton.style.backgroundImage = `url('${smileStates[1]}')`;
        isMouseDown = true;
      }
    });
    // eslint-disable-next-line no-loop-func
    cell.addEventListener('mouseup', () => {
      if (!isGameOver)
        smileButton.style.backgroundImage = `url('${smileStates[0]}')`;
      isMouseDown = false;
    });
    // eslint-disable-next-line no-loop-func
    cell.addEventListener('mouseleave', () => {
      if (isMouseDown && !isGameOver) {
        smileButton.style.backgroundImage = `url('${smileStates[0]}')`;
        isMouseDown = false;
      }
    });
    ceils.appendChild(cell);
  }
}

// put mines on cells in the game zone
let mines;
let cellMinesAround;
let minesCount;
let isFirstCellClick = true;
function putMines(cellNum) {
  // create mines array
  mines = [];
  minesCount = Math.floor((gameFieldSize * gameFieldSize) / 10);
  flagsCount = minesCount;
  cellMinesAround = [];

  // fill all cells with zero bombs around
  for (let i = 0; i < gameFieldSize; i++) {
    cellMinesAround[i] = [];
    for (let j = 0; j < gameFieldSize; j++) cellMinesAround[i][j] = 0;
  }

  const getRandomCell = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

  // set bombs on cells
  for (let i = 0; i < minesCount; i++) {
    const cell = getRandomCell(0, gameFieldSize * gameFieldSize - 1);
    if (mines.includes(cell) || cell === cellNum) i--;
    else mines.push(cell);
  }
  // eslint-disable-next-line no-console
  console.log('for crosscheck, location of mines:\n', mines.sort((a, b) => a - b));

  // fill all cells with count bombs around
  for (let i = 0, cell_i = 0; i < gameFieldSize; i++) {
    for (let j = 0; j < gameFieldSize; j++, cell_i++) {
      if (mines.includes(cell_i)) {
        // up cells
        if (i - 1 >= 0) {
          cellMinesAround[i - 1][j]++; // up cell
          if (j - 1 >= 0) cellMinesAround[i - 1][j - 1]++; // up-left cell
          if (j + 1 < gameFieldSize) cellMinesAround[i - 1][j + 1]++; // up-right cell
        }

        // right cell
        if (j + 1 < gameFieldSize) cellMinesAround[i][j + 1]++;
        // left cell
        if (j - 1 >= 0) cellMinesAround[i][j - 1]++;

        // down cells
        if (i + 1 < gameFieldSize) {
          cellMinesAround[i + 1][j]++; // down cell
          if (j - 1 >= 0) cellMinesAround[i + 1][j - 1]++; // down-left cell
          if (j + 1 < gameFieldSize) cellMinesAround[i + 1][j + 1]++; // down-right cell
        }
      }
    }
  }
}

function drawAllMines() {
  // eslint-disable-next-line no-restricted-syntax
  for (const iterator of mines) {
    const cell = cells[iterator];
    cell.style.background = 'rgba(255, 0, 0, 0.5)';
    cell.style.backgroundImage = "url('Assets/img/mine.png')";
    cell.style.backgroundRepeat = 'no-repeat';
    cell.style.backgroundPosition = 'center';
    cell.style.backgroundSize = 'cover';
  }
}

let intervalID;
let seconds = 0;
function startTimer() {
  stopTimer();
  intervalID = setInterval(updateTimer, 1000);
}

function stopTimer(isClear = false) {
  if (isClear) seconds = 0;
  clearInterval(intervalID);
}

function updateTimer() {
  seconds++;
  document.querySelector('.timer').textContent = seconds.toString();
}

const setActiveCell = (cell) => {
  cell.classList.add('__active');
  cell.classList.remove('game-field__cell');
};

const soundCellClick = new Audio('Assets/sounds/cell_click.ogg');
const soundBlust = new Audio('Assets/sounds/blust.ogg');
function cellClick() {
  if (!isGameOver) {
    const cell = this;
    if (
      !cell.classList.contains('__active')
      && !cell.classList.contains('flag')
    ) {
      countMoves++;
      document.querySelector('.moves').textContent = countMoves.toString();
      const cellNum = parseInt(cell.classList[1], 10);

      if (isFirstCellClick) {
        isFirstCellClick = false;
        putMines(cellNum);
        startTimer();
      }

      setActiveCell(cell);

      if (mines.includes(cellNum)) {
        buildDefeatMenu();
        document.querySelector('.smile-btn').style.backgroundImage = `url('${smileStates[2]}')`;
        stopTimer(true);
        drawAllMines();
        soundBlust.pause();
        soundBlust.currentTime = 0;
        if (soundBlust.paused) soundBlust.play();
        isGameOver = true;
        return;
      }
      soundCellClick.play();
      cellDrawCountBombsAround(cellNum);
    }
  }
}

const drawMinesAroundRGB = (cell, count) => {
  const cellNow = cell;
  if (count === 1) cellNow.style.color = 'blue';
  else if (count === 2) cellNow.style.color = 'green';
  else if (count === 3) cellNow.style.color = 'red';
  else if (count === 4) cellNow.style.color = 'darkblue';
  else if (count === 5) cellNow.style.color = 'brown';
  else if (count === 6) cellNow.style.color = 'darkgreen';
  else if (count === 7) cellNow.style.color = 'black';
  else if (count === 8) cellNow.style.color = 'gray';
};

let cells;
let cellsText;
function cellDrawCountBombsAround(cellNum) {
  cells = document.querySelectorAll('.cell');
  for (let i = 0, cell_i = 0; i < gameFieldSize; i++) {
    for (let j = 0; j < gameFieldSize; j++, cell_i++) {
      if (cell_i === cellNum) {
        if (cellMinesAround[i][j] !== 0) {
          cells[cell_i].textContent = cellMinesAround[i][j];
          drawMinesAroundRGB(cells[cell_i], cellMinesAround[i][j]);
        } else {
          // open all zero cell around
          cellsText = new Array(cells.length);
          showZeroAround(cell_i, i, j, 'up');
          showZeroAround(cell_i, i, j, 'down');
          showZeroAround(cell_i, i, j, 'right');
          showZeroAround(cell_i, i, j, 'left');
        }
        return;
      }
    }
  }
}

function showZeroAround(cell_i, i, j, direction) {
  if (direction === 'up' && i - 1 >= 0) {
    if (
      cellMinesAround[i - 1][j] === 0
      && cellsText[cell_i - gameFieldSize] !== '0'
      && !cells[cell_i - gameFieldSize].classList.contains('flag')
    ) {
      setActiveCell(cells[cell_i - gameFieldSize]);
      cellsText[cell_i - gameFieldSize] = '0';
      showZeroAround(cell_i - gameFieldSize, i - 1, j, 'up');
      showZeroAround(cell_i - gameFieldSize, i - 1, j, 'right');
      showZeroAround(cell_i - gameFieldSize, i - 1, j, 'left');
    } else if (
      cellMinesAround[i - 1][j] !== 0
      && cells[cell_i - gameFieldSize].textContent === ''
      && !cells[cell_i - gameFieldSize].classList.contains('flag')
    ) {
      setActiveCell(cells[cell_i - gameFieldSize]);
      cells[cell_i - gameFieldSize].textContent = cellMinesAround[i - 1][j].toString();
      drawMinesAroundRGB(
        cells[cell_i - gameFieldSize],
        cellMinesAround[i - 1][j]
      );
    }
  }

  if (direction === 'down' && i + 1 < gameFieldSize) {
    if (
      cellMinesAround[i + 1][j] === 0
      && cellsText[cell_i + gameFieldSize] !== '0'
      && !cells[cell_i + gameFieldSize].classList.contains('flag')
    ) {
      setActiveCell(cells[cell_i + gameFieldSize]);
      cellsText[cell_i + gameFieldSize] = '0';
      showZeroAround(cell_i + gameFieldSize, i + 1, j, 'down');
      showZeroAround(cell_i + gameFieldSize, i + 1, j, 'left');
      showZeroAround(cell_i + gameFieldSize, i + 1, j, 'right');
    } else if (
      cellMinesAround[i + 1][j] !== 0
      && cells[cell_i + gameFieldSize].textContent === ''
      && !cells[cell_i + gameFieldSize].classList.contains('flag')
    ) {
      setActiveCell(cells[cell_i + gameFieldSize]);
      cells[cell_i + gameFieldSize].textContent = cellMinesAround[i + 1][j].toString();
      drawMinesAroundRGB(
        cells[cell_i + gameFieldSize],
        cellMinesAround[i + 1][j]
      );
    }
  }

  if (direction === 'right' && j + 1 < gameFieldSize) {
    if (cellMinesAround[i][j + 1] === 0 && cellsText[cell_i + 1] !== '0' && !cells[cell_i + 1].classList.contains('flag')) {
      setActiveCell(cells[cell_i + 1]);
      cellsText[cell_i + 1] = '0';
      showZeroAround(cell_i + 1, i, j + 1, 'right');
      showZeroAround(cell_i + 1, i, j + 1, 'up');
      showZeroAround(cell_i + 1, i, j + 1, 'down');
    } else if (
      cellMinesAround[i][j + 1] !== 0
      && cells[cell_i + 1].textContent === ''
      && !cells[cell_i + 1].classList.contains('flag')
    ) {
      setActiveCell(cells[cell_i + 1]);
      cells[cell_i + 1].textContent = cellMinesAround[i][j + 1].toString();
      drawMinesAroundRGB(cells[cell_i + 1], cellMinesAround[i][j + 1]);
    }
  }

  if (direction === 'left' && j - 1 >= 0) {
    if (cellMinesAround[i][j - 1] === 0 && cellsText[cell_i - 1] !== '0' && !cells[cell_i - 1].classList.contains('flag')) {
      setActiveCell(cells[cell_i - 1]);
      cellsText[cell_i - 1] = '0';
      showZeroAround(cell_i - 1, i, j - 1, 'left');
      showZeroAround(cell_i - 1, i, j - 1, 'up');
      showZeroAround(cell_i - 1, i, j - 1, 'down');
    } else if (
      cellMinesAround[i][j - 1] !== 0
      && cells[cell_i - 1].textContent === ''
      && !cells[cell_i - 1].classList.contains('flag')
    ) {
      setActiveCell(cells[cell_i - 1]);
      cells[cell_i - 1].textContent = cellMinesAround[i][j - 1].toString();
      drawMinesAroundRGB(cells[cell_i - 1], cellMinesAround[i][j - 1]);
    }
  }
}

function rebuildGameZone() {
  const gameField = document.querySelector('.game-field');
  gameField.remove();
  isFirstCellClick = true;
  isGameOver = false;
  countMoves = 0;
  stopTimer(true);
  buildFields();
}

// if gameFieldSize will change
document.addEventListener('gameFieldSizeChange', () => {
  rebuildGameZone();
});

document.addEventListener('contextmenu', (event) => {
  event.preventDefault();
});

function main() {
  buildMainMenu();
  buildFields();
}
main();
