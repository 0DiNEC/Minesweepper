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
export let gameFieldSize;
let gameFieldSizeIndex;

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
  } else if (localStorage.getItem('difficult') === gameMode.normalMode.toString()) {
    gameFieldSize = gameMode.normalMode;
    gameFieldSizeIndex = 1;
  } else if (localStorage.getItem('difficult') === gameMode.hardMode.toString()) {
    gameFieldSize = gameMode.hardMode;
    gameFieldSizeIndex = 2;
  } else {
    localStorage.setItem('difficult', gameMode.easyMode.toString());
    gameFieldSize = gameMode.easyMode;
    gameFieldSizeIndex = 0;
  }
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

  const flagButton = document.createElement('button');
  flagButton.classList = 'main-menu__new-game main-menu__btn';
  flagButton.style.backgroundImage = "url('assets/img/flag.png')";
  mainMenuButtons.appendChild(flagButton);

  const bestScopeButton = document.createElement('button');
  bestScopeButton.classList = 'main-menu__best-score main-menu__btn';
  bestScopeButton.style.backgroundImage = "url('assets/img/rewards.png')";
  mainMenuButtons.appendChild(bestScopeButton);
}

export function buildDefeatMenu() {}
