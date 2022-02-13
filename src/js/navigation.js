import { getAllWordsInLevelFromServ, resetResults } from './page-sprint';
import { getAllWordsInLevelFromServ as getWordsAudio, resetResults as resetResultsAudiocall } from './audio-call';
import { userIsLogged, logOutOfAccount } from './registration';

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
const buttonGameAudiocall = document.querySelector('#button-game-audiocall');
const pageAudiocall = document.querySelector('.section-game-audiocall');
const theCrossAudiocallPage = document.querySelector('.the-cross-audiocall-page');
const buttonMainPage = document.querySelector('#button-main-page');
const footerHTML = document.querySelector('footer');
const registrationButtonMainPage = document.querySelector('.registration-button');
const sectionRegistration = document.querySelector('.section-registration');
const backRegistrationButtons = document.querySelectorAll('.button-back-registration-log-in');

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

// ------------переход между секциями-----------

pages.push(mainPage);
pages.push(pageСhoiceGame);
pages.push(sectionGameSprint);
pages.push(pageAudiocall);

buttonMiniGames.addEventListener('click', function () {
    goToAnotherPage(pageСhoiceGame);
    openCloseMenu();
});

buttonSprintGame.addEventListener('click', async function () {
    await getAllWordsInLevelFromServ();
    goToAnotherPage(sectionGameSprint);
});

buttonGameAudiocall.addEventListener('click', async function () {
    await getWordsAudio();
    goToAnotherPage(pageAudiocall);
});

theCrossAudiocallPage.addEventListener('click', function () {
    goToAnotherPage(pageСhoiceGame);
    resetResultsAudiocall();
});

theCrossSprintPage.addEventListener('click', function () {
    goToAnotherPage(pageСhoiceGame);
    resetResults();
});

buttonMainPage.addEventListener('click', function () {
    resetResultsAudiocall();
    resetResults();
    goToAnotherPage(mainPage);
    openCloseMenu();
});

registrationButtonMainPage.addEventListener('click', function () {
    if (userIsLogged) {
        logOutOfAccount();
        return;
    }
    sectionRegistration.classList.add('section-registration-open');
    shadow.classList.add('shadow-on');
    buttonMenu.style.zIndex = '0';
});

backRegistrationButtons.forEach((element) => {
    element.addEventListener('click', closePageRegistration);
});

function closePageRegistration() {
    shadow.classList.remove('shadow-on');
    buttonMenu.style.zIndex = '1';
    sectionRegistration.classList.remove('section-registration-open');
}

function goToAnotherPage(page) {
    if (page === pageAudiocall || page === sectionGameSprint) {
        footerHTML.style.display = 'none';
    } else {
        footerHTML.style.display = 'inherit';
    }
    pages.forEach((element) => element.classList.add('hide-block'));
    page.classList.remove('hide-block');
}
export { closePageRegistration };
