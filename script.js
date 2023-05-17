const gameField_EasyModeSize = 5;
const gameField_NormalModeSize = 10;
const gameField_HardModeSize = 20;

let gameField_Size = gameField_EasyModeSize;
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

  const size = gameField_Size !== gameField_HardModeSize ? 100 /*px*/ : 30 /*px*/;

  const ceils = document.createElement('div');
  ceils.classList = 'game-field__ceils';
  ceils.style.gridTemplateColumns = `repeat(${gameField_Size}, ${size}px)`
  ceils.style.gridTemplateRows  = `repeat(${gameField_Size}, ${size}px)`
  gameField.appendChild(ceils);

  for (let j = 0; j < gameField_Size; j++)
    for (let i = 0; i < gameField_Size; i++) {
      const cell = document.createElement('div');
      cell.classList = `game-field__cell cell_num${i + (j*10)} cell_`;
      ceils.appendChild(cell);
    }
}

buildFields();
