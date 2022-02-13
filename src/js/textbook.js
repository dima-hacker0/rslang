const difficultyLevelTextbook = document.querySelector('.difficulty-level-textbook');
const blockTextbookWords = document.querySelector('.textbook-words');
const prevPageButton = document.querySelector('.prev-page-button');
const nextPageButton = document.querySelector('.next-page-button');
const numberPageHTML = document.querySelector('.number-page');
const wordOnEnglishTextbook = document.querySelector('.word-on-english-textbook');
const translateWordOnEnglishTextbook = document.querySelector('.translate-word-on-english-textbook');
const transcriptionTextbook = document.querySelector('.transcription-textbook');
const meaningWordExample = document.querySelector('#meaning-word-example');
const meaningWordExampleTranslate = document.querySelector('#meaning-word-example-translate');
const exampleUseWord = document.querySelector('#example-use-word');
const exampleUseWordTranslate = document.querySelector('#example-use-word-translate');
const imgTextbookMain = document.querySelector('.img-textbook-main');
const buttonListeningWordTextbook = document.querySelector('.button-listening-word-textbook');
const addDifficultWordsTextbook = document.querySelector('.add-difficult-words-textbook');
const buttonAddLearnedWord = document.querySelector('.button-learned-word');
const textButtonDifficultwords = document.querySelector('.text-button-difficult-words');
const blockDiffucultLearnedButtons = document.querySelector('.block-diffucult-learned-buttons');
const buttonRemoveDifficultWord = document.querySelector('.button-remove-difficult-word');
const numberPageBlock = document.querySelector('.number-page-block');

const NUMBERS_DIFFICULTY_LEVELS = 6;
const NUMBERS_CARDS = 20;
let currentTextBookPage = 1;
let currentDifficultyLevel = 1;
let currentNumberCard = 1;
let colorsButton = ['#66ccce', '#9CD7F9', '#ce6698', '#FF7171', '#ce9c66', '#8A78FA', '#2c2647'];
let token = JSON.parse(localStorage.getItem('userInformation')).token;
let userId = JSON.parse(localStorage.getItem('userInformation')).userId;
let pageIsLoaded = true;

async function getInformationFromServer(levelDifficulty, numberPage) {
    const rawResponse = await fetch(`https://react-learnwords-dima-hacker0.herokuapp.com/words?page=${numberPage}&group=${levelDifficulty}`, {
        method: 'GET'
    });
    const words = await rawResponse.json();
    return words;
}

async function changeLevelDifficulty(number) {
    numberPageBlock.classList.remove('hide-block');
    blockDiffucultLearnedButtons.classList.remove('hide-block');
    buttonRemoveDifficultWord.classList.add('hide-block');
    textButtonDifficultwords.style.opacity = '0.3';
    for (let i = 1; i < NUMBERS_DIFFICULTY_LEVELS + 1; i++) {
        document.querySelector(`#circle-difficukty-button-${i}`).classList.remove('chousen-level-text-book');
        document.querySelector(`#describe-level-difficulty-${i}`).classList.remove('chousen-level-text-book');
        document.querySelector(`#level-difficulty-textbook-${i}`).classList.remove('chousen-level-text-book');
    }
    document.querySelector(`#circle-difficukty-button-${number}`).classList.add('chousen-level-text-book');
    document.querySelector(`#describe-level-difficulty-${number}`).classList.add('chousen-level-text-book');
    document.querySelector(`#level-difficulty-textbook-${number}`).classList.add('chousen-level-text-book');
    addDifficultWordsTextbook.style.backgroundColor = colorsButton[number - 1];
    buttonAddLearnedWord.style.backgroundColor = colorsButton[number - 1];
    numberPageHTML.innerHTML = '1/30';
    const words = await getInformationFromServer(number - 1, 0);
    await addCardsOnPage(number, words);
}

changeLevelDifficulty(1);

async function addCardsOnPage(numberDifficulty, words) {
    pageIsLoaded = false;
    let arrId = [];
    for (let i = 0; i < words.length; i++) {
        if (words[i].id === undefined) {
            arrId[i] = words[i]._id;
        } else {
            arrId[i] = words[i].id;
        }
    }
    while (blockTextbookWords.firstChild) {
        blockTextbookWords.removeChild(blockTextbookWords.firstChild);
    }
    for (let i = 0; i < words.length; i++) {
        let card = `
        <div id="card-textbook-word-translate-${i + 1}" class="card-textbook-word-translate ${arrId[i]}">
            <div class="card-textbook-word">${words[i].word}</div>
            <div class="card-word-translate">${words[i].wordTranslate}</div>
            <div style="background-color: ${colorsButton[numberDifficulty - 1]}" id="circle-chousen-word-${i + 1}" class="circle-chousen-word hide-circle"></div>
            <div style="display: none;" id="circle-difficult-word-${i + 1}" class="circle-difficult-word"></div>
        </div>
        `;
        blockTextbookWords.insertAdjacentHTML('beforeend', card);
    }
    pickCard(1);
    let arrPromises = [];
    for (let i = 0; i < words.length; i++) {
        arrPromises[i] = checkDifficultWord(arrId[i]);
    }
    Promise.all(arrPromises)
    .then(function (responses) {
        pageIsLoaded = true;
        responses.forEach(
        function (response, i) {
            if (response === 'isDifficult') {
                document.querySelector(`#circle-difficult-word-${i + 1}`).style.display = 'inherit';
                document.querySelector(`#circle-difficult-word-${i + 1}`).style.backgroundColor = 'black';
            } else if (response === 'isLearned') {
                document.querySelector(`#circle-difficult-word-${i + 1}`).style.display = 'inherit';
                document.querySelector(`#circle-difficult-word-${i + 1}`).style.backgroundColor = '#00bf97';
            }
        }
    );
    });
}

async function pickCard(numberCard) {
    currentNumberCard = numberCard;
    for (let i = 1; i < NUMBERS_CARDS + 1; i++) {
        document.querySelector(`#circle-chousen-word-${i}`).classList.add('hide-circle');
    }
    document.querySelector(`#circle-chousen-word-${numberCard}`).classList.remove('hide-circle');

    const cardHTML = document.querySelector(`#card-textbook-word-translate-${numberCard}`);
    const cardId = cardHTML.classList[1];

    const rawResponse = await fetch(`https://react-learnwords-dima-hacker0.herokuapp.com/words/${cardId}`, {
        method: 'GET'
    });
    const informationWord = await rawResponse.json();
    let difficultOrNot = await checkDifficultWord(informationWord.id);
    if (difficultOrNot === 'isDifficult') {
        addDifficultWordsTextbook.classList.add('choice-word');
        buttonAddLearnedWord.classList.remove('choice-word');
    } else if (difficultOrNot === 'isLearned') {
        addDifficultWordsTextbook.classList.remove('choice-word');
        buttonAddLearnedWord.classList.add('choice-word');
    } else {
        addDifficultWordsTextbook.classList.remove('choice-word');
        buttonAddLearnedWord.classList.remove('choice-word');
    }
    addDifficultWordsTextbook.id = informationWord.id;
    buttonAddLearnedWord.id = informationWord.id;
    changeWordInformation(informationWord);
}

function changeWordInformation(informationWord) {
    buttonListeningWordTextbook.className = 'button-listening-word-textbook';
    buttonListeningWordTextbook.classList.add(informationWord.audio);
    buttonListeningWordTextbook.classList.add(informationWord.audioMeaning);
    buttonListeningWordTextbook.classList.add(informationWord.audioExample);
    translateWordOnEnglishTextbook.innerHTML = informationWord.wordTranslate;
    wordOnEnglishTextbook.innerHTML = informationWord.word;
    transcriptionTextbook.innerHTML = informationWord.transcription;
    meaningWordExample.innerHTML = informationWord.textMeaning;
    meaningWordExampleTranslate.innerHTML = informationWord.textMeaningTranslate;
    exampleUseWord.innerHTML = informationWord.textExample;
    exampleUseWordTranslate.innerHTML = informationWord.textExampleTranslate;
    imgTextbookMain.src = `https://react-learnwords-dima-hacker0.herokuapp.com/${informationWord.image}`;
}

function listenToWord() {
    let arrAudio = buttonListeningWordTextbook.classList;
    arrAudio = [arrAudio[1], arrAudio[2], arrAudio[3]];
    let audioElements = [];
    for (let i = 0; i < arrAudio.length; i++) {
        let audio = new Audio(`https://react-learnwords-dima-hacker0.herokuapp.com/${arrAudio[i]}`);
        audioElements.push(audio);
        if (i === 0) {
            audioElements[i].play();
        } else {
            audioElements[i - 1].addEventListener('ended', function () {
                audioElements[i].play();
            });
        }
    }
}

async function checkDifficultWord(wordId) {
    const rawResponse = await fetch(`https://react-learnwords-dima-hacker0.herokuapp.com/users/${userId}/aggregatedWords/${wordId}`, {
    method: 'GET',
    withCredentials: true,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  });
  const content = await rawResponse.json();
  if (content[0].userWord) {
    if (content[0].userWord.optional.isDifficult) {
        return 'isDifficult';
    }
    if (content[0].userWord.optional.isLearned) {
        return 'isLearned';
    }
  }
  return false;
}

buttonListeningWordTextbook.addEventListener('click', listenToWord);

difficultyLevelTextbook.addEventListener('click', function (e) {
    if (!e.target.closest('.button-difficulty-level-textbook')) {
        return;
    }
    currentTextBookPage = 1;
    let buttonId = e.target.closest('.button-difficulty-level-textbook').id;
    let numberButton = buttonId.split('-').pop();
    currentDifficultyLevel = numberButton;
    changeLevelDifficulty(numberButton);
});

blockTextbookWords.addEventListener('click', function (e) {
    if (!e.target.closest('.card-textbook-word-translate')) {
        return;
    }
    let buttonId = e.target.closest('.card-textbook-word-translate').id;
    let numberButton = buttonId.split('-').pop();
    pickCard(numberButton);
});

prevPageButton.addEventListener('click', async function () {
    if (currentTextBookPage === 1 || !pageIsLoaded) return;
    currentTextBookPage--;
    numberPageHTML.innerHTML = `${currentTextBookPage}/30`;
    const words = await getInformationFromServer(currentDifficultyLevel - 1, currentTextBookPage - 1);
    await addCardsOnPage(currentDifficultyLevel, words);
});

nextPageButton.addEventListener('click', async function () {
    if (currentTextBookPage === 30 || !pageIsLoaded) return;
    currentTextBookPage++;
    numberPageHTML.innerHTML = `${currentTextBookPage}/30`;
    const words = await getInformationFromServer(currentDifficultyLevel - 1, currentTextBookPage - 1);
    await addCardsOnPage(currentDifficultyLevel, words);
});

export { currentNumberCard, addCardsOnPage };
