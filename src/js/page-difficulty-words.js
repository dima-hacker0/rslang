import { addCardsOnPage } from './textbook';
import { token, userId } from './statistics-day';

const buttonShowDifficultyWords = document.querySelector('.button-show-difficulty-words');
const textButtonDifficultwords = document.querySelector('.text-button-difficult-words');
const blockDiffucultLearnedButtons = document.querySelector('.block-diffucult-learned-buttons');
const buttonRemoveDifficultWord = document.querySelector('.button-remove-difficult-word');
const numberPageBlock = document.querySelector('.number-page-block');

const NUMBERS_DIFFICULTY_LEVELS = 6;

const NUMBER_PAGE_DIFFICULTY_WORDS = 7;

async function getDifficultWords() {
    const rawResponse = await fetch(`https://react-learnwords-dima-hacker0.herokuapp.com/users/${userId}/aggregatedWords?wordsPerPage=4000&filter={"userWord.optional.isDifficult": true}`, {
        method: 'GET',
        withCredentials: true,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });
    const words = await rawResponse.json();
    return words[0].paginatedResults;
}

async function outputDifficultWords() {
    const words = await getDifficultWords();
    textButtonDifficultwords.style.opacity = '1';
    for (let i = 1; i < NUMBERS_DIFFICULTY_LEVELS + 1; i++) {
        document.querySelector(`#circle-difficukty-button-${i}`).classList.remove('chousen-level-text-book');
        document.querySelector(`#describe-level-difficulty-${i}`).classList.remove('chousen-level-text-book');
        document.querySelector(`#level-difficulty-textbook-${i}`).classList.remove('chousen-level-text-book');
    }
    addCardsOnPage(NUMBER_PAGE_DIFFICULTY_WORDS, words);
}
buttonShowDifficultyWords.addEventListener('click', function () {
    blockDiffucultLearnedButtons.classList.add('hide-block');
    buttonRemoveDifficultWord.classList.remove('hide-block');
    numberPageBlock.classList.add('hide-block');
    outputDifficultWords();
});

export { outputDifficultWords };
