export const gameMode = {
  easyMode: 10,
  normalMode: 16,
  hardMode: 30,
};

const gameModeImg = [
  'assets/img/easy.png',
  'assets/img/normal.png',
  'assets/img/hard.png',
];

const gameFieldSizeChange = new CustomEvent('gameFieldSizeChange');
// eslint-disable-next-line import/no-mutable-exports
export let gameFieldSize;
let gameFieldSizeIndex;
// eslint-disable-next-line import/no-mutable-exports
export let isDark = false;

// main menu
export function buildMainMenu() {
  const mainMenu = document.createElement('nav');
  mainMenu.classList = 'main-menu';
  document.body.appendChild(mainMenu);

  const mainMenuButtons = document.createElement('section');
  mainMenuButtons.classList = 'main-menu__buttons';
  mainMenu.appendChild(mainMenuButtons);

  if (localStorage.getItem('difficult') === gameMode.easyMode.toString()) {
    gameFieldSize = gameMode.easyMode;
    gameFieldSizeIndex = 0;
  } else if (
    localStorage.getItem('difficult') === gameMode.normalMode.toString()
  ) {
    gameFieldSize = gameMode.normalMode;
    gameFieldSizeIndex = 1;
  } else if (
    localStorage.getItem('difficult') === gameMode.hardMode.toString()
  ) {
    gameFieldSize = gameMode.hardMode;
    gameFieldSizeIndex = 2;
  } else {
    localStorage.setItem('difficult', gameMode.easyMode.toString());
    gameFieldSize = gameMode.easyMode;
    gameFieldSizeIndex = 0;
  }
  // load best results
  const storedResults = JSON.parse(localStorage.getItem('tempResults'));
  if (storedResults) tempResults = storedResults;

  const difficultButton = document.createElement('button');
  difficultButton.classList = 'main-menu__game-difficulty main-menu__btn';
  difficultButton.style.backgroundImage = `url('${gameModeImg[gameFieldSizeIndex]}')`;

  difficultButton.addEventListener('click', () => {
    gameFieldSizeIndex = (gameFieldSizeIndex + 1) % 3;
    difficultButton.style.backgroundImage = `url('${gameModeImg[gameFieldSizeIndex]}')`;
    if (gameFieldSizeIndex === 0) gameFieldSize = gameMode.easyMode;
    else if (gameFieldSizeIndex === 1) gameFieldSize = gameMode.normalMode;
    else gameFieldSize = gameMode.hardMode;
    localStorage.setItem('difficult', gameFieldSize.toString());
    document.dispatchEvent(gameFieldSizeChange);
  });

  mainMenuButtons.appendChild(difficultButton);

  const darkLightButton = document.createElement('button');
  darkLightButton.classList = 'main-menu__dark-light-mode main-menu__btn';
  darkLightButton.style.backgroundImage = "url('assets/img/moon.png')";
  darkLightButton.addEventListener('click', () => {
    isDark = !isDark;
    darkLightButton.classList.toggle('night');
    document.querySelector('body').classList.toggle('body_night');
    document.querySelector('.main-menu').classList.toggle('main-menu_night');
    document.querySelector('.game-field__header').classList.toggle('game-field_night');
    document.querySelector('.game-field__ceils').classList.toggle('game-field_night');
    document.querySelectorAll('.cell').forEach((cell) => cell.classList.toggle('game-field-cell_night'));
    document.querySelector('.smile-btn').classList.toggle('smile-btn_night');
    const topScoreDialog = document.querySelector('.top-score-dialog');
    if (topScoreDialog)
      topScoreDialog.classList.toggle('dialog_night');
    const defeatDialog = document.querySelector('.dialog__defeat');
    if (defeatDialog)
      defeatDialog.classList.toggle('dialog_night');
    const winDialog = document.querySelector('.dialog__win');
    if (winDialog)
      winDialog.classList.toggle('dialog_night');

    if (darkLightButton.classList.contains('night'))
      darkLightButton.style.backgroundImage = "url('assets/img/sun.png')";
    else darkLightButton.style.backgroundImage = "url('assets/img/moon.png')";
  });
  mainMenuButtons.appendChild(darkLightButton);

  const bestScopeButton = document.createElement('button');
  bestScopeButton.classList = 'main-menu__best-score main-menu__btn';
  bestScopeButton.style.backgroundImage = "url('assets/img/rewards.png')";
  bestScopeButton.addEventListener('click', buildTopScore);
  mainMenuButtons.appendChild(bestScopeButton);
}

// Defeat menu
export function buildDefeatMenu() {
  const dialog = document.createElement('div');
  dialog.classList = 'dialog';

  const menu = document.createElement('div');
  menu.classList = 'dialog__defeat';
  if (isDark)
    menu.classList.add('dialog_night');

  const title = document.createElement('h3');
  title.classList = 'dialog_title';
  title.textContent = 'GAME OVER!';

  const message = document.createElement('p');
  message.classList = 'dialog__message';
  message.textContent = 'try again';

  const closeButton = document.createElement('button');
  closeButton.classList = 'dialog__close-button';
  closeButton.style.backgroundImage = "url('Assets/img/close.png')";
  closeButton.addEventListener('click', hideLossDialog);

  menu.appendChild(title);
  menu.appendChild(message);
  menu.appendChild(closeButton);
  dialog.append(menu);

  document.body.appendChild(dialog);
}

// Win menu
export function buildWinMenu(time, moves) {
  const dialog = document.createElement('div');
  dialog.classList = 'dialog';

  const menu = document.createElement('div');
  menu.classList = 'dialog__win';
  if (isDark)
    menu.classList.add('dialog_night');

  const title = document.createElement('h3');
  title.classList = 'dialog_title';
  title.textContent = 'YOU WIN!';

  const message = document.createElement('p');
  message.classList = 'dialog__message';
  message.textContent = `YOUR RESULT TIME ${time} MOVES ${moves}`;

  const closeButton = document.createElement('button');
  closeButton.classList = 'dialog__close-button';
  closeButton.style.backgroundImage = "url('Assets/img/close.png')";
  closeButton.addEventListener('click', hideLossDialog);

  menu.appendChild(title);
  menu.appendChild(message);
  menu.appendChild(closeButton);
  dialog.append(menu);

  document.body.appendChild(dialog);
}

let tempResults = {
  difficult: [],
  moves: [],
  time: [],
};

export function saveTempResult(time, movesCount) {
  tempResults.difficult.push(gameModeImg[gameFieldSizeIndex]);
  tempResults.moves.push(movesCount);
  tempResults.time.push(time);

  const sortOrder = [
    'assets/img/hard.png',
    'assets/img/normal.png',
    'assets/img/easy.png',
  ];
  const sortedResults = tempResults.difficult
    .map((difficultt, index) => ({
      difficult: difficultt,
      moves: tempResults.moves[index],
      time: tempResults.time[index],
    }))
    .sort((a, b) => {
      const difficultSort = sortOrder.indexOf(a.difficult) - sortOrder.indexOf(b.difficult);
      if (difficultSort !== 0) {
        return difficultSort;
      } return a.time - b.time;
    });

  // rerecord
  const maxRecords = 10;
  tempResults.difficult = sortedResults.slice(0, maxRecords).map((result) => result.difficult);
  tempResults.moves = sortedResults.slice(0, maxRecords).map((result) => result.moves);
  tempResults.time = sortedResults.slice(0, maxRecords).map((result) => result.time);

  localStorage.setItem('tempResults', JSON.stringify(tempResults));
}

// Build best score dialog
function buildTopScore() {
  if (!document.querySelector('.top-score-dialog')) {
    const dialog = document.createElement('div');
    dialog.classList = 'top-score-dialog';

    if (isDark)
      dialog.classList.add('dialog_night');

    const title = document.createElement('h1');
    title.classList = 'top-score-dialog__title';
    title.textContent = 'Your best result:';
    dialog.appendChild(title);

    const result = document.createElement('div');
    result.classList = 'result';

    const resultDifficult = document.createElement('div');
    resultDifficult.classList = 'result__difficult';
    resultDifficult.textContent = 'LEVEL';

    const resultTime = document.createElement('div');
    resultTime.classList = 'result__time';
    resultTime.textContent = 'TIME';

    const resultMoves = document.createElement('div');
    resultMoves.classList = 'result__moves';
    resultMoves.textContent = 'MOVES';

    result.appendChild(resultDifficult);
    result.appendChild(resultTime);
    result.appendChild(resultMoves);

    for (let i = 0; i < tempResults.difficult.length; i++) {
      const playerResDifficult = document.createElement('img');
      playerResDifficult.classList = 'result__difficult';
      const playerResTime = document.createElement('div');
      playerResTime.classList = 'result__time';
      const playerResMoves = document.createElement('div');
      playerResMoves.classList = 'result__moves';

      if (tempResults.difficult[i])
        playerResDifficult.src = `${tempResults.difficult[i]}`;
      else {
        playerResDifficult.src = 'Assets/img/none.png';
        playerResDifficult.alt = '--------';
      }

      if (tempResults.time[i]) playerResTime.textContent = tempResults.time[i];
      else playerResTime.textContent = '--------';

      if (tempResults.moves[i])
        playerResMoves.textContent = tempResults.moves[i];
      else playerResMoves.textContent = '--------';

      result.appendChild(playerResDifficult);
      result.appendChild(playerResTime);
      result.appendChild(playerResMoves);
    }

    const closeButton = document.createElement('button');
    closeButton.classList = 'dialog__close-button';
    closeButton.style.backgroundImage = "url('Assets/img/close.png')";
    closeButton.addEventListener('click', hideTopScoreDialog);

    dialog.appendChild(result);
    dialog.appendChild(closeButton);
    document.body.appendChild(dialog);
  } else hideTopScoreDialog();
}

function hideLossDialog() {
  const dialog = document.querySelector('.dialog');
  if (dialog) dialog.remove();
}

function hideTopScoreDialog() {
  const dialog = document.querySelector('.top-score-dialog');
  if (dialog) dialog.remove();
}
