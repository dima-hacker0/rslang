import { getAllWordsInLevelFromServ, resetResults } from './page-sprint';

const buttonMenu = document.querySelector('.icon-nav');
const firstMenuLine = document.querySelector('.first-line');
const secondMenuLine = document.querySelector('.second-line');
const thirdMenuLine = document.querySelector('.third-line');
const shadow = document.querySelector('#shadow');
const sectionNavigation = document.querySelector('.navigation-section');
const buttonMiniGames = document.querySelector('#button-mini-games');
const mainPage = document.querySelector('.main-page');
const pageСhoiceGame = document.querySelector('.page-mini-games');
const buttonSprintGame = document.querySelector('#button-game-sprint');
const sectionGameSprint = document.querySelector('.section-game-sprint');
const theCrossSprintPage = document.querySelector('.the-cross-sprint-page');
let pages = [];

// --------открытие / закрытие меню
function openCloseMenu() {
    firstMenuLine.classList.toggle('open-menu-first-line');
    secondMenuLine.classList.toggle('open-menu-second-line');
    thirdMenuLine.classList.toggle('open-menu-third-line');
    sectionNavigation.classList.toggle('hide-navigation');
    shadow.classList.toggle('shadow-on');
}
buttonMenu.addEventListener('click', openCloseMenu);
shadow.addEventListener('click', openCloseMenu);

// ------------переход между секциями-----------
pages.push(mainPage);
pages.push(pageСhoiceGame);
pages.push(sectionGameSprint);

buttonMiniGames.addEventListener('click', function () {
    goToAnotherPage(pageСhoiceGame);
    openCloseMenu();
});

buttonSprintGame.addEventListener('click', async function () {
    await getAllWordsInLevelFromServ();
    goToAnotherPage(sectionGameSprint);
});

theCrossSprintPage.addEventListener('click', function () {
    goToAnotherPage(pageСhoiceGame);
    resetResults();
});

function goToAnotherPage(page) {
    pages.forEach((element) => element.classList.add('hide-block'));
    page.classList.remove('hide-block');
}
