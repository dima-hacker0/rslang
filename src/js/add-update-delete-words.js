import { currentNumberCard } from './textbook';
import { outputDifficultWords } from './page-difficulty-words';
import { token, userId } from './statistics-day';

const buttonAddLearnedWord = document.querySelector('.button-learned-word');
const addDifficultWordsTextbook = document.querySelector('.add-difficult-words-textbook');
const buttonRemoveDifficultWord = document.querySelector('.button-remove-difficult-word');

async function getWordInformation(wordId) {
    const rawResponse = await fetch(`https://react-learnwords-dima-hacker0.herokuapp.com/users/${userId}/aggregatedWords/${wordId}`, {
    method: 'GET',
    withCredentials: true,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  });
  const wordInformation = await rawResponse.json();
  if (wordInformation[0].userWord === undefined) {
    return 'thisIsNewWord';
  }
  return wordInformation;
}

async function addWord(wordId, object) {
  await fetch(`https://react-learnwords-dima-hacker0.herokuapp.com/users/${userId}/words/${wordId}`, {
    method: 'POST',
    withCredentials: true,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(object)
  });
}

async function updateWord(wordId, object) {
  await fetch(`https://react-learnwords-dima-hacker0.herokuapp.com/users/${userId}/words/${wordId}`, {
    method: 'PUT',
    withCredentials: true,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(object)
  });
}

buttonRemoveDifficultWord.addEventListener('click', async function () {
  const card = document.querySelector(`#card-textbook-word-translate-${currentNumberCard}`);
  let wordId = card.classList[1];
  let wordData = await getWordInformation(wordId);
  let objectOptional = JSON.parse(JSON.stringify(wordData[0].userWord.optional));
  objectOptional.isDifficult = false;
  await updateWord(wordId, { optional: objectOptional });
  outputDifficultWords();
});

addDifficultWordsTextbook.addEventListener('click', async function () {
  let circleDifficultOrLearned = document.querySelector(`#circle-difficult-word-${currentNumberCard}`);
  circleDifficultOrLearned.style.backgroundColor = 'black';
  circleDifficultOrLearned.style.display = 'inherit';
  addDifficultWordsTextbook.classList.add('choice-word');
  buttonAddLearnedWord.classList.remove('choice-word');
  let newOrOldWord = await getWordInformation(this.id);
  if (newOrOldWord === 'thisIsNewWord') {
    addWord(this.id, { optional: { isDifficult: true, isLearned: false } });
  } else {
    let updateWordData = JSON.parse(JSON.stringify(newOrOldWord[0].userWord.optional));
    updateWordData.isDifficult = true;
    updateWordData.isLearned = false;
    updateWord(this.id, { optional: updateWordData });
  }
});

buttonAddLearnedWord.addEventListener('click', async function () {
    let circleDifficultOrLearned = document.querySelector(`#circle-difficult-word-${currentNumberCard}`);
    circleDifficultOrLearned.style.backgroundColor = '#00bf97';
    circleDifficultOrLearned.style.display = 'inherit';
    addDifficultWordsTextbook.classList.remove('choice-word');
    buttonAddLearnedWord.classList.add('choice-word');
    let newOrOldWord = await getWordInformation(this.id);
    if (newOrOldWord === 'thisIsNewWord') {
      addWord(this.id, { optional: { isLearned: true, isDifficult: false } });
    } else {
      let updateWordData = JSON.parse(JSON.stringify(newOrOldWord[0].userWord.optional));
      updateWordData.isDifficult = false;
      updateWordData.isLearned = true;
      updateWord(this.id, { optional: updateWordData });
    }
});

export { addWord, updateWord, getWordInformation };
