const gameField_EasyModeSize = 5;
const gameField_NormalModeSize = 10;
const gameField_HardModeSize = 20;

let gameField_Size = gameField_NormalModeSize;
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

  const size =
    gameField_Size === gameField_EasyModeSize
      ? 15
      : gameField_Size === gameField_NormalModeSize
      ? 8
      : 4.5;

  const ceils = document.createElement('div');
  ceils.classList = 'game-field__ceils';
  ceils.style.gridTemplateColumns = `repeat(${gameField_Size}, ${size}vh)`;
  ceils.style.gridAutoRows = `${size}vh`;
  gameField.appendChild(ceils);

  for (let i = 0; i < gameField_Size * gameField_Size; i++) {
    const cell = document.createElement('div');
    cell.classList = `game-field__cell ${i} cell_`;
    cell.addEventListener('click', cell_Click);

    ceils.appendChild(cell);
  }
}
buildFields();

// put mines on cells in the game zone
let mines;
let cellMinesAround;
let isFirstCell_Click = true;
function putMines(cellNum) {
  // create mines array
  mines = new Array();
  minesCount = gameField_Size;
  cellMinesAround = new Array();

  // fill all cells with zero bombs around
  for (let i = 0; i < gameField_Size; i++) {
    cellMinesAround[i] = new Array();
    for (let j = 0; j < gameField_Size; j++) cellMinesAround[i][j] = 0;
  }

  let getRandomCell = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  // set bombs on cells
  for (let i = 0; i < minesCount; i++) {
    const cell = getRandomCell(0, minesCount * minesCount - 1);
    if (mines.includes(cell) || cell === cellNum) {
      i--;
      continue;
    } else mines.push(cell);
  }
  // log
  console.log(mines);

  // fill all cells with count bombs around
  for (let i = 0, cell_i = 0; i < gameField_Size; i++)
    for (let j = 0; j < gameField_Size; j++, cell_i++) {
      if (mines.includes(cell_i)) {
       
        // up cells
        if (i - 1 >= 0){
          cellMinesAround[i - 1][j]++; // up cell
          if (j - 1 >= 0) cellMinesAround[i - 1][j - 1]++; // up-left cell
          if (j + 1 < gameField_Size) cellMinesAround[i - 1][j + 1]++; // up-right cell
        } 
        
        // right cell
        if (j + 1 < gameField_Size) cellMinesAround[i][j + 1]++;
        // left cell
        if (j - 1 >= 0) cellMinesAround[i][j - 1]++;

        //down cells
        if (i + 1 < gameField_Size){
          cellMinesAround[i + 1][j]++; // down cell
          if (j-1 >= 0) cellMinesAround[i+1][j-1]++; // down-left cell
          if (j+1 < gameField_Size) cellMinesAround[i+1][j+1]++; // down-right cell
        } 
        
      }
    }

  console.log(cellMinesAround);
}

function cell_Click() {
  const cell = this;
  const cellNum = parseInt(cell.classList[1]);
  console.log(cellNum);
  if (isFirstCell_Click) {
    isFirstCell_Click = false;
    putMines(cellNum);
  }

  cell.style.background = '#cccccc';

  if (mines.includes(cellNum)) {
    cell.style.backgroundImage = "url('Assets/img/mine.png')";
    cell.style.backgroundRepeat = 'no-repeat';
    cell.style.backgroundPosition = 'center';
  }

  cell_DrawCountBombsAround();
}

function cell_DrawCountBombsAround() {
  const cells = document.querySelectorAll('.cell_');
  for (let i = 0, cell_i = 0; i < gameField_Size; i++)
    for (let j = 0; j < gameField_Size; j++, cell_i++) {
      cells[cell_i].textContent = cellMinesAround[i][j];
    }
}
