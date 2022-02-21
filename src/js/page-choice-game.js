const blockLevelEnglishButton = document.querySelector('.block-buttons-level-english');
const NUMBERS_BUTTONS_LEVEL_ENGLISH = 6;
let levelOfEnglishLevel = 0;
blockLevelEnglishButton.addEventListener('click', function (e) {
    if (!e.target.classList.contains('button-level-english')) {
        return;
    }
    const numberButton = e.target.id.split('-').pop();
    levelOfEnglishLevel = Number(numberButton) - 1;
    const clickButton = document.querySelector(`#number-level-button-${numberButton}`);
    for (let i = 1; i < NUMBERS_BUTTONS_LEVEL_ENGLISH + 1; i++) {
        document.querySelector(`#number-level-button-${i}`).classList.remove('click-button');
    }
    clickButton.classList.add('click-button');
});
export { levelOfEnglishLevel };
