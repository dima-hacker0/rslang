import { closePageRegistration } from './navigation';
import { updateTodayData, updateToken } from './statistics-day';
import { changeLevelDifficulty } from './textbook';

const buttonLogInPopap = document.querySelector('.button-log-in-account');
const buttonRegistrationPopap = document.querySelector('.button-registration-account');
const lineOfSelectPage = document.querySelector('.chose-rigistration-page');
const containerRegistrAndLogIn = document.querySelector('.container-registr-and-log-in');
const inputEmailRegistration = document.querySelector('.input-email-registration');
const textErrorEmail = document.querySelector('.text-error-email');
const inputPasswordRegistration = document.querySelector('.input-password-registration');
const textErrorPassword = document.querySelector('.text-error-password');
const buttonRegistrationtoAccount = document.querySelector('.button-registration-to-account');
const inputNameRegistration = document.querySelector('.input-name-registration');
const textErrorName = document.querySelector('.text-error-name');
const inputEmailLogIn = document.querySelector('.input-email-log-in');
const inputPasswordLogIn = document.querySelector('.input-password-log-in');
const buttonLogInToAccount = document.querySelector('.button-log-in-to-account');
const errorWrongEmailOrPassword = document.querySelector('.error-wrong-email-or-password');
const nameOfUser = document.querySelector('.name-of-user');
const inforamtionAboutUser = document.querySelector('.inforamtion-about-user');
const registrationButton = document.querySelector('.registration-button');
const buttonLogOut = document.querySelector('.img-exit');
const contentForLogInUsers = document.querySelectorAll('.content-for-log-in-users');

let userIsLogged = false;

function changePagRegistrationPopap(page) {
    if (page === 'log-in') {
        buttonLogInPopap.classList.add('selected-button-registr');
        buttonRegistrationPopap.classList.remove('selected-button-registr');
        lineOfSelectPage.style.transform = 'translate(0%)';
        containerRegistrAndLogIn.style.transform = 'translate(0%)';
    } else {
        buttonLogInPopap.classList.remove('selected-button-registr');
        buttonRegistrationPopap.classList.add('selected-button-registr');
        lineOfSelectPage.style.transform = 'translate(100%)';
        containerRegistrAndLogIn.style.transform = 'translate(-50%)';
    }
}

function checkValidationEmail() {
    textErrorEmail.innerHTML = 'электронная почта должна иметь форму username@example.com , где: username - имя пользователя, должно содержать от 3 до 15 символов (буквы, цифры, подчеркивания, дефисы), не должно содержать пробелов; example - домен первого уровня состоит не менее чем из 2 латинских букв; com - домен верхнего уровня, отделенный от домена первого уровня точкой и состоящий не менее чем из 2 латинских букв.';
    let regMail = /^([a-z\d_-]{3,15})@([a-z]{2,999})\.([a-z]{2,4})$/;
    if (regMail.test(`${inputEmailRegistration.value}`)) {
        inputEmailRegistration.style.borderBottom = '2px solid #dbd7d2';
        textErrorEmail.classList.add('text-error-email-hide');
        return true;
    }
    inputEmailRegistration.style.borderBottom = '2px solid #f57359';
    textErrorEmail.classList.remove('text-error-email-hide');
    return false;
}

function checkValidationPassword() {
    if (inputPasswordRegistration.value.length < 8 && inputPasswordRegistration.value.length >= 0) {
        inputPasswordRegistration.style.borderBottom = '2px solid #f57359';
        textErrorPassword.classList.remove('text-error-password-hide');
        return false;
    }
    inputPasswordRegistration.style.borderBottom = '2px solid #dbd7d2';
    textErrorPassword.classList.add('text-error-password-hide');
    return true;
}

function checkValidationName() {
    if (inputNameRegistration.value === '') {
        inputNameRegistration.style.borderBottom = '2px solid #f57359';
        textErrorName.classList.remove('hide-block');
        return false;
    }
    inputNameRegistration.style.borderBottom = '2px solid #dbd7d2';
    textErrorName.classList.add('hide-block');
    return true;
}

async function registration() {
    let user = {
        name: inputNameRegistration.value,
        email: inputEmailRegistration.value,
        password: inputPasswordRegistration.value
    };
    checkValidationEmail();
    checkValidationName();
    checkValidationPassword();
    if (!checkValidationPassword() || !checkValidationEmail() || !checkValidationName()) {
        return;
    }
    const rawResponse = await fetch('https://react-learnwords-dima-hacker0.herokuapp.com/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    });
    if (rawResponse.status === 417) {
        textErrorEmail.innerHTML = 'Эта почта уже занята';
        textErrorEmail.classList.remove('text-error-email-hide');
        inputEmailRegistration.style.borderBottom = '2px solid #f57359';
        return;
    }
    logIntoAccount(user);
}

async function logIntoAccount(objectEmailAndPassword) {
    const rawResponse = await fetch('https://react-learnwords-dima-hacker0.herokuapp.com/signin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(objectEmailAndPassword)
    });
    if (rawResponse.status >= 400) {
        errorWrongEmailOrPassword.classList.remove('hide-block');
        return;
    }
    const content = await rawResponse.json();
    localStorage.setItem('userInformation', JSON.stringify(content));
    logIntoAccountHTML(content.name);
    updateToken();
    updateTodayData();
}

function logIntoAccountHTML(nameUser) {
    nameOfUser.innerHTML = nameUser;
    inforamtionAboutUser.classList.remove('hide-block');
    contentForLogInUsers.forEach(element => element.classList.remove('content-for-log-in-users'));
    closePageRegistration();
    registrationButton.innerHTML = 'Выйти';
    userIsLogged = true;
    changeLevelDifficulty(1);
}

window.onload = function () {
    if (localStorage.getItem('userInformation') !== null) {
        let nameUser = JSON.parse(localStorage.getItem('userInformation')).name;
        logIntoAccountHTML(nameUser);
    }
};

function logOutOfAccount() {
    userIsLogged = false;
    registrationButton.innerHTML = 'Войти';
    inforamtionAboutUser.classList.add('hide-block');
    contentForLogInUsers.forEach(element => element.classList.add('content-for-log-in-users'));
    localStorage.removeItem('userInformation');
    changeLevelDifficulty(1);
}
buttonLogInPopap.addEventListener('click', function () {
    changePagRegistrationPopap('log-in');
});

buttonRegistrationPopap.addEventListener('click', function () {
    changePagRegistrationPopap('registration');
});

buttonLogOut.addEventListener('click', logOutOfAccount);

inputEmailRegistration.addEventListener('input', checkValidationEmail);

inputPasswordRegistration.addEventListener('input', checkValidationPassword);

buttonRegistrationtoAccount.addEventListener('click', registration);

inputNameRegistration.addEventListener('input', checkValidationName);

buttonLogInToAccount.addEventListener('click', function () {
    let user = {
        email: inputEmailLogIn.value,
        password: inputPasswordLogIn.value
    };
    logIntoAccount(user);
});

inputPasswordLogIn.addEventListener('input', function () {
    errorWrongEmailOrPassword.classList.add('hide-block');
});
inputEmailLogIn.addEventListener('input', function () {
    errorWrongEmailOrPassword.classList.add('hide-block');
});

export { userIsLogged, logOutOfAccount };
