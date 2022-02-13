import { levelOfEnglishLevel } from './page-choice-game';
import { addRightOrFalseAnswer, listenToWordResultsPage } from './page-sprint';
const buttonRepeatWordAudiocall = document.querySelector('.button-repeat-word-audiocall');
const blockResponseOptionsAudiocall = document.querySelector('.block-response-options-audiocall');
const audioWrongAnswer = document.querySelector('#audio-wrong-answer');
const audioRightAnswer = document.querySelector('#audio-right-answer');
const buttonNextWorldAudiocall = document.querySelector('.button-next-world-audiocall');
const lineOfProgress = document.querySelector('.line-of-progress');
const imgAnswerAudiocall = document.querySelector('.img-answer-audiocall');
const answerWordOnEnglishHTML = document.querySelector('.answer-word-on-english');
const blockWithAnswerAudiocall = document.querySelector('.block-with-answer-audiocall');
const wrongAnwersAudiocall = document.querySelector('.list-wrong-answers-audiocall');
const rightAnwersAudiocall = document.querySelector('.list-true-answers-audiocall');
const blockOfAllAnswers = document.querySelector('.area-with-right-and-wrong-answers-audiocall');
const percentRightAnswersHTML = document.querySelector('.percent-right-answers-text-audiocall');
const textMistakesAudioCall = document.querySelector('.text-mistakes-audiocall');
const textRightAudioCall = document.querySelector('.text-right-audiocall');
const areaResultAudiocall = document.querySelector('.area-result-audiocall');
const gameAreaAudiocall = document.querySelector('.game-area-audiocall');

let allWordsInLevel = [];
const PAGES_OF_WORDS = 30;
const NUMBERS_OF_OPTIONS = 5;
let numberOfRightAnswer;
let thereIsAnswer = false;
let numbersOfRightAnswer = 0;
let numbersOfWrongAnswer = 0;
let translateGuessWord;
let guessWord;
let audioRightAnswerId;
let victorineIsRunning = false;

async function getAllWordsInLevelFromServ() {
    for (let i = 0; i < PAGES_OF_WORDS; i++) {
        const rawResponse = await fetch(`https://react-learnwords-dima-hacker0.herokuapp.com/words?page=${i}&group=${levelOfEnglishLevel}`, {
            method: 'GET'
        });
        const words = await rawResponse.json();
        allWordsInLevel = [...allWordsInLevel, ...words];
    }
    victorineIsRunning = true;
    createNewQuestion();
}

function createNewQuestion() {
    let arrayFiveRandomNumbers = [];
    for (let i = 0; i < NUMBERS_OF_OPTIONS;) {
        let randomNumber = Math.floor(Math.random() * (allWordsInLevel.length - 1));
        if (arrayFiveRandomNumbers.indexOf(randomNumber) === -1) {
            arrayFiveRandomNumbers.push(randomNumber);
            i++;
        }
    }
    numberOfRightAnswer = Math.floor(Math.random() * 5 + 1);
    translateGuessWord = allWordsInLevel[arrayFiveRandomNumbers[numberOfRightAnswer - 1]].wordTranslate;
    audioRightAnswerId = allWordsInLevel[arrayFiveRandomNumbers[numberOfRightAnswer - 1]].audio;
    guessWord = allWordsInLevel[arrayFiveRandomNumbers[numberOfRightAnswer - 1]].word;
    const idImgGuessWord = allWordsInLevel[arrayFiveRandomNumbers[numberOfRightAnswer - 1]].image;
    imgAnswerAudiocall.src = `https://react-learnwords-dima-hacker0.herokuapp.com/${idImgGuessWord}`;
    answerWordOnEnglishHTML.innerHTML = guessWord;
    buttonRepeatWordAudiocall.id = audioRightAnswerId;
    let audio = new Audio(`https://react-learnwords-dima-hacker0.herokuapp.com/${audioRightAnswerId}`);
    audio.play();
    for (let i = 0; i < NUMBERS_OF_OPTIONS; i++) {
        document.querySelector(`#word-audiocall-${i + 1}`).innerHTML = allWordsInLevel[arrayFiveRandomNumbers[i]].wordTranslate;
    }
}

blockResponseOptionsAudiocall.addEventListener('click', function (e) {
    if (thereIsAnswer) return;
    thereIsAnswer = true;
    if (e.target.closest('.response-option-audiocall') === null) return;
    const buttonUserAnswer = e.target.closest('.response-option-audiocall');
    const numberOfUserAnswer = Number(buttonUserAnswer.id.split('-').pop());
    checkRightOrWrongAnswer(numberOfUserAnswer);
    showOrHideImgAndWord('show');
});

function checkRightOrWrongAnswer(numberAnswerFromUser) {
    let buttonClickedUser = document.querySelector(`#button-answer-audiocall-${numberAnswerFromUser}`);
    let buttonRightAnswer = document.querySelector(`#button-answer-audiocall-${numberOfRightAnswer}`);
    buttonNextWorldAudiocall.innerHTML = 'Дальше';
    if (numberAnswerFromUser === numberOfRightAnswer) {
        addRightOrFalseAnswer(guessWord, translateGuessWord, true, audioRightAnswerId, rightAnwersAudiocall);
        audioRightAnswer.play();
        numbersOfRightAnswer++;
    } else {
        addRightOrFalseAnswer(guessWord, translateGuessWord, false, audioRightAnswerId, wrongAnwersAudiocall);
        buttonClickedUser.classList.add('false-answer-audiocall');
        audioWrongAnswer.play();
        numbersOfWrongAnswer++;
    }
    let numbersOfAnswers = numbersOfRightAnswer + numbersOfWrongAnswer;
    lineOfProgress.style.background = `-webkit-linear-gradient(left, #00bf97 0%, #00bf97 ${numbersOfAnswers * 10}%, #fff ${numbersOfAnswers * 10}%, #fff 100%)`;
    buttonRightAnswer.classList.add('right-answer-audiocall');
}

function showOrHideImgAndWord() {
    blockWithAnswerAudiocall.classList.toggle('hide-block');
    buttonRepeatWordAudiocall.classList.toggle('button-repeat-word-audiocall-open-answer');
}

buttonRepeatWordAudiocall.addEventListener('click', function () {
    let audio = new Audio(`https://react-learnwords-dima-hacker0.herokuapp.com/${this.id}`);
    audio.play();
});

function iDontNowAnswerOrnextQuestion() {
    for (let i = 1; i < NUMBERS_OF_OPTIONS + 1; i++) {
        let buttonOptionGame = document.querySelector(`#button-answer-audiocall-${i}`);
        buttonOptionGame.classList.remove('right-answer-audiocall');
        buttonOptionGame.classList.remove('false-answer-audiocall');
    }
    if (thereIsAnswer) {
        buttonNextWorldAudiocall.innerHTML = 'Не знаю';
        createNewQuestion();
        thereIsAnswer = false;
        showOrHideImgAndWord('hide');
        if (numbersOfWrongAnswer + numbersOfRightAnswer === 10) {
            endGameAndShowResult();
        }
    } else {
        numbersOfWrongAnswer++;
        addRightOrFalseAnswer(guessWord, translateGuessWord, false, audioRightAnswerId, wrongAnwersAudiocall);
        lineOfProgress.style.background = `-webkit-linear-gradient(left, #00bf97 0%, #00bf97 ${(numbersOfWrongAnswer + numbersOfRightAnswer) * 10}%, #fff ${(numbersOfWrongAnswer + numbersOfRightAnswer) * 10}%, #fff 100%)`;
        buttonNextWorldAudiocall.innerHTML = 'Дальше';
        const buttonRightAnswer = document.querySelector(`#button-answer-audiocall-${numberOfRightAnswer}`);
        buttonRightAnswer.classList.add('right-answer-audiocall');
        thereIsAnswer = true;
        showOrHideImgAndWord('show');
    }
}

window.addEventListener('keydown', function (e) {
    if (!victorineIsRunning) return;
    if (e.key === 'ArrowRight') {
        iDontNowAnswerOrnextQuestion();
    }
    if (thereIsAnswer) {
        return;
    }
    if (e.key === '1') {
        checkRightOrWrongAnswer(1);
        thereIsAnswer = true;
    } else if (e.key === '2') {
        checkRightOrWrongAnswer(2);
        thereIsAnswer = true;
    } else if (e.key === '3') {
        checkRightOrWrongAnswer(3);
        thereIsAnswer = true;
    } else if (e.key === '4') {
        checkRightOrWrongAnswer(4);
        thereIsAnswer = true;
    } else if (e.key === '5') {
        checkRightOrWrongAnswer(5);
        thereIsAnswer = true;
    } else {
        return;
    }
    showOrHideImgAndWord('show');
});

function resetResults() {
    victorineIsRunning = false;
    lineOfProgress.style.background = '-webkit-linear-gradient(left, #00bf97 0%, #00bf97 0%, #fff 0%, #fff 100%)';
    allWordsInLevel = [];
    thereIsAnswer = false;
    numbersOfRightAnswer = 0;
    numbersOfWrongAnswer = 0;
    areaResultAudiocall.classList.add('hide-block');
    gameAreaAudiocall.classList.remove('hide-block');
    while (wrongAnwersAudiocall.firstChild) {
        wrongAnwersAudiocall.removeChild(wrongAnwersAudiocall.firstChild);
    }
    while (rightAnwersAudiocall.firstChild) {
        rightAnwersAudiocall.removeChild(rightAnwersAudiocall.firstChild);
    }
}

function endGameAndShowResult() {
    victorineIsRunning = false;
    percentRightAnswersHTML.innerHTML = `Процент правильных ответов: ${numbersOfRightAnswer * 10}%`;
    textMistakesAudioCall.innerHTML = `Ошибок: ${numbersOfWrongAnswer}`;
    textRightAudioCall.innerHTML = `Знаю: ${numbersOfRightAnswer}`;
    areaResultAudiocall.classList.remove('hide-block');
    gameAreaAudiocall.classList.add('hide-block');
}
buttonNextWorldAudiocall.addEventListener('click', iDontNowAnswerOrnextQuestion);
blockOfAllAnswers.addEventListener('click', listenToWordResultsPage);
export { getAllWordsInLevelFromServ, resetResults };
