import { addWord, updateWord, getWordInformation } from './add-update-delete-words';

const mainNumberStatisticsPercent = document.querySelector('#main-number-statistics-percent-right');
const mainNumberNewWords = document.querySelector('#main-number-new-words');
const percentRightAnswersSprintHTML = document.querySelector('#percent-right-answers-sprint');
const percentRightAnswersAudiocallHTML = document.querySelector('#percent-right-answers-audiocall');
const answersInRowSprint = document.querySelector('#answers-in-row-sprint');
const answersInRowAudiocall = document.querySelector('#answers-in-row-audiocall');

let todayData = new Date();
todayData = `${todayData.getDate()}-${todayData.getMonth() + 1}-${todayData.getFullYear()}`;

let token;
let userId;

const PERCENTAGES = 100;

function updateToken() {
  if (localStorage.getItem('userInformation') !== null) {
    token = JSON.parse(localStorage.getItem('userInformation')).token;
    userId = JSON.parse(localStorage.getItem('userInformation')).userId;
  }
}
updateToken();

async function updateTodayData() {
  const statistics = await getStatistics();
  if (statistics === 'there-are-no-statistics' || statistics.optional.dataNewWord !== todayData) { // сброс статистики на новый день
    createDataStatistic({ optional: { dataNewWord: todayData, sprintAnswers: 0, sprintRightAnswers: 0, audiocallAnswers: 0, audiocallRightAnswers: 0, rightAnswersInRowAudiocall: 0, rightAnswersInRowSprint: 0 } });
  }
}
updateTodayData();

async function getStatistics() {
  const rawResponse = await fetch(`https://react-learnwords-dima-hacker0.herokuapp.com/users/${userId}/statistics`, {
    method: 'GET',
    withCredentials: true,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  });
  if (rawResponse.status === 404) {
    return 'there-are-no-statistics';
  }
  const result = await rawResponse.json();
  return result;
}

async function createDataStatistic(object) {
  await fetch(`https://react-learnwords-dima-hacker0.herokuapp.com/users/${userId}/statistics`, {
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

async function addDataNewWord(wordId) {
  let wordsInformation = await getWordInformation(wordId);
  if (wordsInformation === 'thisIsNewWord') {
    addWord(wordId, { optional: { dataNewWord: todayData } });
    return;
  }
  wordsInformation = JSON.parse(JSON.stringify(wordsInformation[0].userWord.optional));
  if (wordsInformation.hasOwnProperty('dataNewWord')) {
    return;
  }
  wordsInformation.dataNewWord = todayData;
  updateWord(wordId, { optional: wordsInformation });
}

async function getLearnedWords() {
  const rawResponse = await fetch(`https://react-learnwords-dima-hacker0.herokuapp.com/users/${userId}/aggregatedWords?wordsPerPage=4000&filter={"userWord.optional.dataNewWord": "${todayData}"}`, {
    method: 'GET',
    withCredentials: true,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  });
  const words = await rawResponse.json();
  return words;
}

async function updateStatisticsHTML() {
  let learnedWords = await getLearnedWords();
  let statistics = await getStatistics();
  console.log(statistics);
  if (statistics === 'there-are-no-statistics') return;
  let percentRightAnswers = Math.round(((statistics.optional.audiocallRightAnswers + statistics.optional.sprintRightAnswers) / (statistics.optional.audiocallAnswers + statistics.optional.sprintAnswers)) * PERCENTAGES);
  if (isNaN(percentRightAnswers)) {
    percentRightAnswers = 0;
  }
  mainNumberStatisticsPercent.innerHTML = `${percentRightAnswers}%`;
  mainNumberNewWords.innerHTML = learnedWords[0].paginatedResults.length;
  let percentRightAnswersSprint = Math.round((statistics.optional.sprintRightAnswers / statistics.optional.sprintAnswers) * PERCENTAGES);
  if (isNaN(percentRightAnswersSprint)) {
    percentRightAnswersSprint = 0;
  }
  percentRightAnswersSprintHTML.innerHTML = `процент правильных ответов: ${percentRightAnswersSprint}%`;
  let percentRightAnswersAudiocall = Math.round((statistics.optional.audiocallRightAnswers / statistics.optional.audiocallAnswers) * PERCENTAGES);
  if (isNaN(percentRightAnswersAudiocall)) {
    percentRightAnswersAudiocall = 0;
  }
  percentRightAnswersAudiocallHTML.innerHTML = `процент правильных ответов: ${percentRightAnswersAudiocall}%`;
  answersInRowSprint.innerHTML = `самая длинная серия правильных ответов: ${statistics.optional.rightAnswersInRowSprint}`;
  answersInRowAudiocall.innerHTML = `самая длинная серия правильных ответов: ${statistics.optional.rightAnswersInRowAudiocall}`;
}
updateStatisticsHTML();

export {
 createDataStatistic, updateTodayData, updateToken, getStatistics, token, userId, addDataNewWord
};
