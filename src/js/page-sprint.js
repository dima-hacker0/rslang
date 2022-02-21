import { levelOfEnglishLevel } from './page-choice-game';
import { currentTextBookPage, currentDifficultyLevel } from './textbook';
import { goToAnotherPage } from './navigation';
import { updateStatisticsWord } from './statistics';
import { createDataStatistic, getStatistics, addDataNewWord } from './statistics-day';
import { userIsLogged } from './registration';

const areaGameSprint = document.querySelector('.game-area-sprint');
const falseButton = document.querySelector('.false-button-sprint');
const trueButton = document.querySelector('.true-button-sprint');
const englishWordHTML = document.querySelector('.english-word-text');
const translateWordHTML = document.querySelector('.translate-word-text');
const scoreHTML = document.querySelector('.score-sprint');
const coefficientOfGameHTML = document.querySelector('.coefficient-sprint-game');
const timerHTML = document.querySelector('.time-sprint');
const blockWithWrongAnswers = document.querySelector('.list-wrong-answers-sprint');
const blockWithRightAnswers = document.querySelector('.list-true-answers-sprint');
const resultOfSprintHTML = document.querySelector('.result-of-sprint');
const percentRightAnswersText = document.querySelector('.percent-right-answers-text');
const numbersMWrongAnswersHTML = document.querySelector('.text-mistakes-sprint');
const numbersRightAnswerssHTML = document.querySelector('.text-right-sprint');
const blockOfAllAnswers = document.querySelector('.area-with-right-and-wrong-answers');
const areaResultSprint = document.querySelector('.area-result-sprint');
const audioWrongAnswer = document.querySelector('#audio-wrong-answer');
const audioRightAnswer = document.querySelector('#audio-right-answer');
const buttonStartSprintTextbook = document.querySelector('#button-start-sprint-textbook');
const sectionGameSprint = document.querySelector('.section-game-sprint');
const buttonSprintGame = document.querySelector('#button-game-sprint');
const theCrossSprintPage = document.querySelector('.the-cross-sprint-page');

const TIME_TO_PLAY = 60;
const PAGES_OF_WORDS = 30;
let allWordsInLevel = [];
let trueOrFalseAnswer;
let sprintIsRunning = false;
let rightAnswersInRow = 0;
let scoreGameSprint = 0;
let currentGuessWord;
let currentTranslateGuessWord;
let currentGuessAudio;
let numdersRightAnswers = 0;
let numbersWrongAnswers = 0;
let timer;
let currentGuessObject;

async function getAllWordsInLevelFromServ() {
    for (let i = 0; i < PAGES_OF_WORDS; i++) {
        const rawResponse = await fetch(`https://react-learnwords-dima-hacker0.herokuapp.com/words?page=${i}&group=${levelOfEnglishLevel}`, {
            method: 'GET'
        });
        const words = await rawResponse.json();
        allWordsInLevel = [...allWordsInLevel, ...words];
    }
}

async function createNewQuestion() {
    if (allWordsInLevel.length === 1) {
        await getAllWordsInLevelFromServ();
    }
    const randomWordsNumber = Math.floor(Math.random() * (allWordsInLevel.length - 1));
    currentGuessObject = { ...allWordsInLevel[randomWordsNumber] };
    trueOrFalseAnswer = Math.floor(Math.random() * 2);
    englishWordHTML.innerHTML = allWordsInLevel[randomWordsNumber].word;
    currentGuessWord = allWordsInLevel[randomWordsNumber].word;
    currentGuessAudio = allWordsInLevel[randomWordsNumber].audio;
    currentTranslateGuessWord = allWordsInLevel[randomWordsNumber].wordTranslate;
    let numberFalseTranslate;
    if (trueOrFalseAnswer === 0) {
        translateWordHTML.innerHTML = allWordsInLevel[randomWordsNumber].wordTranslate;
    } else {
        numberFalseTranslate = Math.floor(Math.random() * (allWordsInLevel.length));
        while (numberFalseTranslate === randomWordsNumber) {
            numberFalseTranslate = Math.floor(Math.random() * (allWordsInLevel.length));
        }
        translateWordHTML.innerHTML = allWordsInLevel[numberFalseTranslate].wordTranslate;
    }
    allWordsInLevel.splice(randomWordsNumber, 1);
}

async function checkAnswer(answerFromUser) {
    let statistics;
    if (userIsLogged) {
        statistics = JSON.parse(JSON.stringify(await getStatistics()));
        statistics = statistics.optional;
        statistics.sprintAnswers++;
    }
    if (answerFromUser === trueOrFalseAnswer) {
        audioRightAnswer.currentTime = 0;
        audioRightAnswer.play();
        numdersRightAnswers++;
        addRightOrFalseAnswer(currentGuessWord, currentTranslateGuessWord, true, currentGuessAudio, blockWithRightAnswers);
        areaGameSprint.classList.add('right-answer');
        changeScore();
        rightAnswersInRow++;
        setTimeout(function () {
            areaGameSprint.classList.remove('right-answer');
        }, 500);
        if (userIsLogged) {
            statistics.sprintRightAnswers++;
            updateStatisticsWord(currentGuessObject.id, 'sprint', true);
            if (rightAnswersInRow > statistics.rightAnswersInRowSprint) {
                statistics.rightAnswersInRowSprint = rightAnswersInRow;
            }
        }
    } else {
        audioWrongAnswer.currentTime = 0;
        audioWrongAnswer.play();
        numbersWrongAnswers++;
        addRightOrFalseAnswer(currentGuessWord, currentTranslateGuessWord, false, currentGuessAudio, blockWithWrongAnswers);
        rightAnswersInRow = 0;
        coefficientOfGameHTML.innerHTML = 'X1';
        areaGameSprint.classList.add('false-answer');
        setTimeout(function () {
            areaGameSprint.classList.remove('false-answer');
        }, 500);
        if (userIsLogged) {
            updateStatisticsWord(currentGuessObject.id, 'sprint', false);
        }
    }
    createNewQuestion();
    if (userIsLogged) {
        createDataStatistic({ optional: statistics });
        addDataNewWord(currentGuessObject.id);
    }
}

falseButton.addEventListener('click', function () {
    checkAnswer(1);
});
trueButton.addEventListener('click', function () {
    checkAnswer(0);
});

function changeScore() {
    if (rightAnswersInRow >= 0 && rightAnswersInRow < 3) {
        coefficientOfGameHTML.innerHTML = 'X1';
        scoreGameSprint += 10;
    } else if (rightAnswersInRow > 2 && rightAnswersInRow < 6) {
        coefficientOfGameHTML.innerHTML = 'X2';
        scoreGameSprint += 20;
    } else if (rightAnswersInRow > 5 && rightAnswersInRow < 8) {
        coefficientOfGameHTML.innerHTML = 'X4';
        scoreGameSprint += 40;
    } else {
        coefficientOfGameHTML.innerHTML = 'X8';
        scoreGameSprint += 80;
    }
    scoreHTML.innerHTML = `Score: ${scoreGameSprint}`;
}

function startStopTimer() {
    let currentGameTime = TIME_TO_PLAY;
    timer = setInterval(() => {
        currentGameTime--;
        if (currentGameTime === 0) {
            endGameAndShowResult();
        }
        timerHTML.innerHTML = currentGameTime;
    }, 1000);
}

window.addEventListener('keydown', function (e) {
    if (!sprintIsRunning) return;
    if (e.key === 'ArrowLeft') {
        checkAnswer(1);
    } else if (e.key === 'ArrowRight') {
        checkAnswer(0);
    }
});

function addRightOrFalseAnswer(word, translate, rightOrFalse, idAudio, block) {
    let answerHTML = `
    <div class="anwer-result">
        <img id="${idAudio}" class="img-listen-to-word" src="src/img/svg/sound.svg" alt="play">
        <div class="text-and-its-translate-sprint">${word} - ${translate}</div>
    </div>`;
    if (rightOrFalse) {
        block.insertAdjacentHTML('afterbegin', answerHTML);
    } else {
        block.insertAdjacentHTML('afterbegin', answerHTML);
    }
}

function endGameAndShowResult() {
    clearInterval(timer);
    resultOfSprintHTML.innerHTML = `Ваш результат: ${scoreGameSprint} очков`;
    let perscentRightAnswers = Math.ceil((numdersRightAnswers / (numdersRightAnswers + numbersWrongAnswers)) * 100);
    if (Number.isNaN(perscentRightAnswers)) perscentRightAnswers = 0;
    percentRightAnswersText.innerHTML = `Процент правильных ответов: ${perscentRightAnswers}%`;
    numbersMWrongAnswersHTML.innerHTML = `Ошибок: ${numbersWrongAnswers}`;
    numbersRightAnswerssHTML.innerHTML = `Знаю: ${numdersRightAnswers}`;
    areaResultSprint.classList.remove('hide-block');
    areaGameSprint.classList.add('hide-block');
    sprintIsRunning = false;
}

function listenToWordResultsPage(e) {
    if (!e.target.classList.contains('img-listen-to-word')) {
        return;
    }
    let audio = new Audio(`https://react-learnwords-dima-hacker0.herokuapp.com/${e.target.id}`);
    audio.play();
}

function resetResults() {
    allWordsInLevel = [];
    sprintIsRunning = false;
    rightAnswersInRow = 0;
    scoreGameSprint = 0;
    numdersRightAnswers = 0;
    numbersWrongAnswers = 0;
    scoreHTML.innerHTML = 'Score: 0';
    coefficientOfGameHTML.innerHTML = 'X1';
    timerHTML.innerHTML = '60';
    clearInterval(timer);
    areaResultSprint.classList.add('hide-block');
    areaGameSprint.classList.remove('hide-block');
    while (blockWithWrongAnswers.firstChild) {
        blockWithWrongAnswers.removeChild(blockWithWrongAnswers.firstChild);
    }
    while (blockWithRightAnswers.firstChild) {
        blockWithRightAnswers.removeChild(blockWithRightAnswers.firstChild);
    }
}

async function getWordsForMiniGames() {
    const rawResponse = await fetch(`https://react-learnwords-dima-hacker0.herokuapp.com/words?page=${currentTextBookPage - 1}&group=${currentDifficultyLevel - 1}`, {
        method: 'GET'
    });
    const words = await rawResponse.json();
    return words;
}

buttonSprintGame.addEventListener('click', async function () {
    await getAllWordsInLevelFromServ();
    goToAnotherPage(sectionGameSprint);
    theCrossSprintPage.setAttribute('data-frompage', 'page-choice-game');
    sprintIsRunning = true;
    startStopTimer();
    createNewQuestion();
});

buttonStartSprintTextbook.addEventListener('click', async function () {
    let gameWords = await getWordsForMiniGames();
    allWordsInLevel = [...gameWords];
    startStopTimer();
    createNewQuestion();
    sprintIsRunning = true;
});

blockOfAllAnswers.addEventListener('click', listenToWordResultsPage);

export {
 getAllWordsInLevelFromServ, resetResults, addRightOrFalseAnswer, listenToWordResultsPage, createNewQuestion, getWordsForMiniGames
};
