const gameMode = {
  easyMode: 5,
  normalMode: 10,
  hardMode: 20,
};

const gameFieldSize = gameMode.normalMode;
let countMoves = 0;

function buildFields() {
  const gameField = document.createElement('section');
  gameField.classList = 'game-field';
  document.body.appendChild(gameField);
  gameField.insertAdjacentHTML(
    'afterbegin',
    `
  <div class='game-field__header'>
  <div class='timer'>
  <p class='timer__title'>time</p>
  <p class='timer__time'>0:00</p>
  </div>
  <div class='moves'>
  <p class='moves__title'>moves</p>
  <p class='moves__count'>0</p>
  </div>
  </div>
  `
  );

  let size;
  if (gameFieldSize === gameMode.easyMode) size = 15;
  else if (gameFieldSize === gameMode.normalMode) size = 8;
  else size = 4.5;

  const ceils = document.createElement('div');
  ceils.classList = 'game-field__ceils';
  ceils.style.gridTemplateColumns = `repeat(${gameFieldSize}, ${size}vh)`;
  ceils.style.gridAutoRows = `${size}vh`;
  gameField.appendChild(ceils);

  for (let i = 0; i < gameFieldSize * gameFieldSize; i++) {
    const cell = document.createElement('div');
    cell.classList = `game-field__cell ${i} cell`;
    cell.addEventListener('click', cellClick);

    ceils.appendChild(cell);
  }
}
buildFields();

// put mines on cells in the game zone
let mines;
let cellMinesAround;
let isFirstCellClick = true;
function putMines(cellNum) {
  // create mines array
  mines = [];
  const minesCount = gameFieldSize;
  cellMinesAround = [];

  // fill all cells with zero bombs around
  for (let i = 0; i < gameFieldSize; i++) {
    cellMinesAround[i] = [];
    for (let j = 0; j < gameFieldSize; j++) cellMinesAround[i][j] = 0;
  }

  const getRandomCell = (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  // set bombs on cells
  for (let i = 0; i < minesCount; i++) {
    const cell = getRandomCell(0, minesCount * minesCount - 1);
    if (mines.includes(cell) || cell === cellNum) i--;
    else mines.push(cell);
  }
  // eslint-disable-next-line no-console
  console.log(mines);

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

  // eslint-disable-next-line no-console
  console.log(cellMinesAround);
}

const setActiveCell = (cell) => {
  cell.classList.add('__active');
  cell.classList.remove('game-field__cell');
};

function cellClick() {
  const cell = this;
  if (!cell.classList.contains('__active')) {
    countMoves++;
    const cellNum = parseInt(cell.classList[1], 10);

    if (isFirstCellClick) {
      isFirstCellClick = false;
      putMines(cellNum);
    }

    setActiveCell(cell);

    if (mines.includes(cellNum)) {
      cell.style.backgroundImage = "url('Assets/img/mine.png')";
      cell.style.backgroundRepeat = 'no-repeat';
      cell.style.backgroundPosition = 'center';
    }

    if (mines.includes(cellNum)) return;
    cellDrawCountBombsAround(cellNum);
  }
}

let cells;
function cellDrawCountBombsAround(cellNum) {
  cells = document.querySelectorAll('.cell');
  for (let i = 0, cell_i = 0; i < gameFieldSize; i++) {
    for (let j = 0; j < gameFieldSize; j++, cell_i++) {
      if (cell_i === cellNum) {
        if (cellMinesAround[i][j] !== 0)
          cells[cell_i].textContent = cellMinesAround[i][j];
        else {
          // open all zero cell around
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
  if (direction === 'up') {
    if (i - 1 >= 0) {
      if (cellMinesAround[i - 1][j] === 0) {
        setActiveCell(cells[cell_i - gameFieldSize]);
        showZeroAround(cell_i - gameFieldSize, i - 1, j, 'up');
      }
    }
  }
  if (direction === 'down') {
    if (i + 1 < gameFieldSize) {
      if (cellMinesAround[i + 1][j] === 0) {
        setActiveCell(cells[cell_i + gameFieldSize]);
        showZeroAround(cell_i + gameFieldSize, i + 1, j, 'down');
      }
    }
  }
  if (direction === 'right') {
    if (j + 1 < gameFieldSize) {
      if (cellMinesAround[i][j + 1] === 0) {
        setActiveCell(cells[cell_i + 1]);
        showZeroAround(cell_i + 1, i, j + 1, 'right');
        if (i - 1 >= 0) showZeroAround(cell_i + 1, i, j + 1, 'up');
        if (i + 1 < gameFieldSize) showZeroAround(cell_i + 1, i, j + 1, 'down');
      }
    }
  }
  if (direction === 'left') {
    if (j - 1 >= 0) {
      if (cellMinesAround[i][j - 1] === 0) {
        setActiveCell(cells[cell_i - 1]);
        showZeroAround(cell_i - 1, i, j - 1, 'left');
        if (i - 1 >= 0) showZeroAround(cell_i - 1, i, j - 1, 'up');
        if (i + 1 < gameFieldSize) showZeroAround(cell_i - 1, i, j - 1, 'down');
      }
    }
  }
}
