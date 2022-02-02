const buttonMenu = document.querySelector('.icon-nav');
const firstMenuLine = document.querySelector('.first-line');
const secondMenuLine = document.querySelector('.second-line');
const thirdMenuLine = document.querySelector('.third-line');
const shadow = document.querySelector('#shadow');
const sectionNavigation = document.querySelector('.navigation-section');
function openCloseMenu() {
    firstMenuLine.classList.toggle('open-menu-first-line');
    secondMenuLine.classList.toggle('open-menu-second-line');
    thirdMenuLine.classList.toggle('open-menu-third-line');
    sectionNavigation.classList.toggle('hide-navigation');
    shadow.classList.toggle('shadow-on');
}
buttonMenu.addEventListener('click', openCloseMenu);
shadow.addEventListener('click', openCloseMenu);
