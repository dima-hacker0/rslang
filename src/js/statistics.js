import { addWord, updateWord } from './add-update-delete-words';
import { getWordInformation } from './add-update-delete-words';
import { token, userId } from './statistics-day';

const scoreSprintTextbook = document.querySelector('#score-sprint-textbook');
const scoreAudiocallTextbook = document.querySelector('#score-audiocall-textbook');

async function updateStatisticsWord(wordId, miniGame, trueOrFalseAnswer) {
    const rawResponse = await fetch(`https://react-learnwords-dima-hacker0.herokuapp.com/users/${userId}/aggregatedWords/${wordId}`, {
    method: 'GET',
    withCredentials: true,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  });
  let oneOrZiroPoints = trueOrFalseAnswer ? 1 : 0;
  const word = await rawResponse.json();
  if (word[0].userWord === undefined) {
    if (miniGame === 'sprint') {
        await addWord(word[0]._id, { optional: { statSprint: { numbersGames: 1, rightAnswers: oneOrZiroPoints } } });
    } else {
        await addWord(word[0]._id, { optional: { statAudiocall: { numbersGames: 1, rightAnswers: oneOrZiroPoints } } });
    }
  } else {
    let newObject = { ...word[0].userWord.optional };
      if (miniGame === 'sprint') {
        if (newObject.hasOwnProperty('statSprint')) {
            newObject.statSprint.numbersGames++;
            newObject.statSprint.rightAnswers = trueOrFalseAnswer ? newObject.statSprint.rightAnswers + 1 : newObject.statSprint.rightAnswers;
        } else {
            newObject.statSprint = {
                numbersGames: 1,
                rightAnswers: oneOrZiroPoints
            };
        }
      } else {
        if (newObject.hasOwnProperty('statAudiocall')) {
            newObject.statAudiocall.numbersGames++;
            newObject.statAudiocall.rightAnswers = trueOrFalseAnswer ? newObject.statAudiocall.rightAnswers + 1 : newObject.statAudiocall.rightAnswers;
        } else {
            newObject.statAudiocall = {
                numbersGames: 1,
                rightAnswers: oneOrZiroPoints
            };
        }
      }
      await updateWord(word[0]._id, { optional: newObject });
  }
}

async function addInformationHTML(wordId) {
    const wordInformation = await getWordInformation(wordId);
    if (wordInformation === 'thisIsNewWord') {
        scoreSprintTextbook.innerHTML = '0/0';
        scoreAudiocallTextbook.innerHTML = '0/0';
        return;
    }
    if (wordInformation[0].userWord.optional.statSprint === undefined) {
        scoreSprintTextbook.innerHTML = '0/0';
    } else {
        scoreSprintTextbook.innerHTML = `${wordInformation[0].userWord.optional.statSprint.rightAnswers}/${wordInformation[0].userWord.optional.statSprint.numbersGames}`;
    }
    if (wordInformation[0].userWord.optional.statAudiocall === undefined) {
        scoreAudiocallTextbook.innerHTML = '0/0';
    } else {
        scoreAudiocallTextbook.innerHTML = `${wordInformation[0].userWord.optional.statAudiocall.rightAnswers}/${wordInformation[0].userWord.optional.statAudiocall.numbersGames}`;
    }
}

export { updateStatisticsWord, addInformationHTML };
