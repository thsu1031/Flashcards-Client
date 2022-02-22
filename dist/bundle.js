/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/Router.ts":
/*!***********************!*\
  !*** ./src/Router.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HashRouter": () => (/* binding */ HashRouter)
/* harmony export */ });
/* harmony import */ var _controllers_MainController__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./controllers/MainController */ "./src/controllers/MainController.ts");
/* harmony import */ var _controllers_LoginController__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./controllers/LoginController */ "./src/controllers/LoginController.ts");
/* harmony import */ var _controllers_FlashcardController__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./controllers/FlashcardController */ "./src/controllers/FlashcardController.ts");



class HashRouter {
    constructor() {
        this.mainElement = document.getElementById('main-container');
        this.routers = {};
        window.addEventListener('hashchange', this.load.bind(this), false);
    }
    register(hash, callback = function () { }) {
        this.routers[hash] = callback;
    }
    registerIndex(callback = function () { }) {
        this.routers['index'] = callback;
    }
    registerNotFound(callback = function () { }) {
        this.routers['404'] = callback;
    }
    registerError(callback = function () { }) {
        this.routers['error'] = callback;
    }
    load() {
        let hash = location.hash.slice(1);
        let handler;
        if (!hash) {
            handler = this.routers.index;
        }
        else if (!this.routers.hasOwnProperty(hash)) {
            handler = this.routers['404'] || function () { };
        }
        else {
            handler = this.routers[hash];
        }
        try {
            handler.apply(this);
        }
        catch (e) {
            console.log(e);
        }
    }
    switchToLoginView() {
        if (this.mainElement) {
            this.mainElement.innerHTML = "";
            const loginController = new _controllers_LoginController__WEBPACK_IMPORTED_MODULE_1__.LoginController();
            this.mainElement.append(loginController.createView());
        }
    }
    homepageView() {
        if (this.mainElement) {
            this.mainElement.innerHTML = "";
            const mainController = new _controllers_MainController__WEBPACK_IMPORTED_MODULE_0__.MainController();
            this.mainElement.append(mainController.createView());
        }
    }
    switchToFlashcardsView(sessionToken) {
        if (!sessionToken)
            return;
        if (this.mainElement) {
            this.mainElement.innerHTML = "";
            const flashcardsController = new _controllers_FlashcardController__WEBPACK_IMPORTED_MODULE_2__.FlashcardsController();
            if (sessionToken) {
                flashcardsController.setSessionToken(sessionToken);
            }
            this.mainElement.append(flashcardsController.createView());
        }
    }
}


/***/ }),

/***/ "./src/controllers/BaseController.ts":
/*!*******************************************!*\
  !*** ./src/controllers/BaseController.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "BaseController": () => (/* binding */ BaseController)
/* harmony export */ });
class BaseController {
    constructor() {
        this.container = document.createElement("div");
    }
    createElement(elementType, innerText, action) {
        const element = document.createElement(elementType);
        if (innerText) {
            element.innerText = innerText;
        }
        if (action) {
            element.onclick = action;
        }
        this.container.append(element);
        return element;
    }
}


/***/ }),

/***/ "./src/controllers/FlashcardController.ts":
/*!************************************************!*\
  !*** ./src/controllers/FlashcardController.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "FlashcardsController": () => (/* binding */ FlashcardsController)
/* harmony export */ });
/* harmony import */ var _services_FlashcardsService__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../services/FlashcardsService */ "./src/services/FlashcardsService.ts");
/* harmony import */ var _views_FlashcardsView__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../views/FlashcardsView */ "./src/views/FlashcardsView.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};


class FlashcardsController {
    constructor() {
        this.flashcardsService = new _services_FlashcardsService__WEBPACK_IMPORTED_MODULE_0__.FlashcardsService();
        this.flashcardsView = new _views_FlashcardsView__WEBPACK_IMPORTED_MODULE_1__.FlashcardsView();
    }
    setSessionToken(sessionToken) {
        this.sessionToken = sessionToken;
    }
    createView() {
        if (this.sessionToken) {
            this.flashcardsView.createDOM();
            this.getData();
            localStorage.setItem('currentUser', JSON.stringify({ token: this.sessionToken }));
        }
        else {
            this.flashcardsView.createDOM();
        }
        return this.flashcardsView.createDOM();
    }
    getData() {
        return __awaiter(this, void 0, void 0, function* () {
            const flashcardsData = yield this.flashcardsService.getFlashcards(this.sessionToken.tokenId, this.sessionToken.username);
            console.log(flashcardsData);
            for (let i = 0; i < flashcardsData.length; i++) {
                const flahcard = {
                    question: flashcardsData[i].question,
                    answer: flashcardsData[i].answer,
                    isActive: false,
                    _id: flashcardsData[i]._id,
                };
                this.flashcardsView.listingAdd(flahcard, i);
            }
        });
    }
    addData(question, answer) {
        return __awaiter(this, void 0, void 0, function* () {
            const localToken = JSON.parse(localStorage.getItem('currentUser'));
            const addFlashcardsData = yield this.flashcardsService.addFlashcard(localToken.token.tokenId, question, answer, localToken.token.username);
            this.flashcardsView.listingClear();
            const flashcardsData = yield this.flashcardsService.getFlashcards(localToken.token.tokenId, localToken.token.username);
            for (let i = 0; i < flashcardsData.length; i++) {
                const flahcard = {
                    question: flashcardsData[i].question,
                    answer: flashcardsData[i].answer,
                    isActive: false,
                    _id: flashcardsData[i]._id,
                };
                this.flashcardsView.listingAdd(flahcard, i);
            }
        });
    }
}


/***/ }),

/***/ "./src/controllers/LoginController.ts":
/*!********************************************!*\
  !*** ./src/controllers/LoginController.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "LoginController": () => (/* binding */ LoginController)
/* harmony export */ });
/* harmony import */ var _services_LoginService__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../services/LoginService */ "./src/services/LoginService.ts");
/* harmony import */ var _Router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Router */ "./src/Router.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};


class LoginController {
    constructor() {
        this.loginService = new _services_LoginService__WEBPACK_IMPORTED_MODULE_0__.LoginService();
        this.router = new _Router__WEBPACK_IMPORTED_MODULE_1__.HashRouter();
    }
    loginButtonClicked(username, password, event) {
        return __awaiter(this, void 0, void 0, function* () {
            event.preventDefault();
            if (username.value && password.value) {
                const result = yield this.loginService.login(username.value, password.value);
                // console.log(result)
                if (result) {
                    this.router.switchToFlashcardsView(result);
                    window.history.pushState("object or string", "Flashcards", "#/flashcards");
                }
                else {
                    // TODO showErrorLabel
                }
            }
            else {
                // TODO showErrorLabel
            }
        });
    }
    createView() {
        const container = document.createElement("div");
        container.classList.add("container");
        const loginForm = document.createElement("form");
        loginForm.classList.add("form");
        loginForm.setAttribute("id", "form");
        const usernameLoginFormControl = document.createElement("div");
        usernameLoginFormControl.classList.add("form-control");
        const usernameLabel = document.createElement("label");
        usernameLabel.setAttribute("for", "username");
        usernameLabel.innerText = "Username";
        const usernameInput = document.createElement("input");
        usernameInput.setAttribute("type", "text");
        usernameInput.setAttribute("id", "username");
        const usernameErrorMessage = document.createElement("small");
        usernameErrorMessage.innerHTML = "Error message";
        usernameLoginFormControl.append(usernameLabel, usernameInput, usernameErrorMessage);
        const passwordFormControl = document.createElement("div");
        passwordFormControl.classList.add("form-control");
        const passwordLabel = document.createElement("label");
        passwordLabel.setAttribute("for", "password");
        passwordLabel.innerText = "Password";
        const passwordInput = document.createElement("input");
        passwordInput.setAttribute("type", "password");
        passwordInput.setAttribute("id", "password");
        const passwordErrorMessage = document.createElement("small");
        passwordErrorMessage.innerHTML = "Error message";
        passwordFormControl.append(passwordLabel, passwordInput, passwordErrorMessage);
        loginForm.append(usernameLoginFormControl, passwordFormControl);
        const loginButton = document.createElement("button");
        loginButton.innerHTML = "Log in";
        loginButton.setAttribute("type", "submit");
        loginButton.addEventListener('click', this.loginButtonClicked.bind(this, usernameInput, passwordInput));
        const signupLink = document.createElement('a');
        signupLink.innerHTML = "Sign up";
        signupLink.classList.add("link");
        signupLink.setAttribute("href", "");
        loginForm.append(usernameLoginFormControl, passwordFormControl, loginButton, signupLink);
        container.append(loginForm);
        return container;
    }
}


/***/ }),

/***/ "./src/controllers/MainController.ts":
/*!*******************************************!*\
  !*** ./src/controllers/MainController.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "MainController": () => (/* binding */ MainController)
/* harmony export */ });
/* harmony import */ var _services_SignUpService__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../services/SignUpService */ "./src/services/SignUpService.ts");
/* harmony import */ var _Router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Router */ "./src/Router.ts");
/* harmony import */ var _BaseController__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./BaseController */ "./src/controllers/BaseController.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};



class MainController extends _BaseController__WEBPACK_IMPORTED_MODULE_2__.BaseController {
    constructor() {
        super(...arguments);
        this.signupService = new _services_SignUpService__WEBPACK_IMPORTED_MODULE_0__.SignUpService();
        this.router = new _Router__WEBPACK_IMPORTED_MODULE_1__.HashRouter();
    }
    signupButtonClicked(username, email, password1, password2, event) {
        return __awaiter(this, void 0, void 0, function* () {
            event.preventDefault();
            if (!this.checkRequired([username, email, password1, password2])) {
                if (this.checkEmail(email)) { }
                ;
                if (this.checkPasswordsMatch(password1, password2)) { }
                ;
            }
            const result = yield this.signupService.signup(username.value, password1.value);
            if (username.value && password1.value) {
                this.router.switchToFlashcardsView(result);
            }
        });
    }
    createView() {
        const container = document.createElement("div");
        container.classList.add("container");
        const registerForm = document.createElement("form");
        registerForm.classList.add("form");
        registerForm.setAttribute("id", "form");
        const usernameRegisterFormControl = document.createElement("div");
        usernameRegisterFormControl.classList.add("form-control");
        const usernameLabel = document.createElement("label");
        usernameLabel.setAttribute("for", "username");
        usernameLabel.innerText = "Username";
        const usernameInput = document.createElement("input");
        usernameInput.setAttribute("type", "text");
        usernameInput.setAttribute("id", "username");
        const usernameErrorMessage = document.createElement("small");
        usernameErrorMessage.innerHTML = "Error message";
        usernameRegisterFormControl.append(usernameLabel, usernameInput, usernameErrorMessage);
        const emailRegisterFormControl = document.createElement("div");
        emailRegisterFormControl.classList.add("form-control");
        const emailLabel = document.createElement("label");
        emailLabel.setAttribute("for", "email");
        emailLabel.innerText = "Email";
        const emailInput = document.createElement("input");
        emailInput.setAttribute("type", "text");
        emailInput.setAttribute("id", "email");
        const emailErrorMessage = document.createElement("small");
        emailErrorMessage.innerHTML = "Error message";
        emailRegisterFormControl.append(emailLabel, emailInput, emailErrorMessage);
        const password1RegisterFormControl = document.createElement("div");
        password1RegisterFormControl.classList.add("form-control");
        const password1Label = document.createElement("label");
        password1Label.setAttribute("for", "password");
        password1Label.innerText = "Password";
        const password1Input = document.createElement("input");
        password1Input.setAttribute("type", "password");
        password1Input.setAttribute("id", "password1");
        const password1ErrorMessage = document.createElement("small");
        password1ErrorMessage.innerHTML = "Error message";
        password1RegisterFormControl.append(password1Label, password1Input, password1ErrorMessage);
        const password2RegisterFormControl = document.createElement("div");
        password2RegisterFormControl.classList.add("form-control");
        const password2Label = document.createElement("label");
        password2Label.setAttribute("for", "password");
        password2Label.innerText = "Confirm Password";
        const password2Input = document.createElement("input");
        password2Input.setAttribute("type", "password");
        password2Input.setAttribute("id", "password2");
        const password2ErrorMessage = document.createElement("small");
        password2ErrorMessage.innerHTML = "Error message";
        password2RegisterFormControl.append(password2Label, password2Input, password2ErrorMessage);
        const submitButton = document.createElement("button");
        submitButton.innerHTML = "Submit";
        submitButton.setAttribute("type", "submit");
        submitButton.addEventListener("click", this.signupButtonClicked.bind(this, usernameInput, emailInput, password1Input, password2Input));
        const loginLink = document.createElement("a");
        loginLink.classList.add("link");
        loginLink.innerHTML = "Sign in";
        loginLink.setAttribute("href", "#/login");
        registerForm.append(usernameRegisterFormControl, emailRegisterFormControl, password1RegisterFormControl, password2RegisterFormControl, submitButton, loginLink);
        container.append(registerForm);
        return container;
    }
    showErrorLabel(input, errorMessage) {
        const formControl = input.parentElement;
        formControl.className = "form-control error";
        const small = formControl.querySelector("small");
        small.innerText = errorMessage;
    }
    checkEmail(input) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!re.test(input.value.trim())) {
            this.showErrorLabel(input, 'Email is not valid');
            return false;
        }
        return true;
    }
    checkPasswordsMatch(input1, input2) {
        if (input1.value !== input2.value) {
            this.showErrorLabel(input2, 'Passwords do not match');
            return false;
        }
        return true;
    }
    checkRequired(inputArray) {
        let isRequired = false;
        inputArray.forEach((input) => {
            if (input.value.trim() === '') {
                this.showErrorLabel(input, 'It is required');
                isRequired = true;
            }
        });
        return isRequired;
    }
}


/***/ }),

/***/ "./src/services/FlashcardsService.ts":
/*!*******************************************!*\
  !*** ./src/services/FlashcardsService.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "FlashcardsService": () => (/* binding */ FlashcardsService)
/* harmony export */ });
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const baseUrl = "http://localhost:8080/";
const flashcardsUrl = baseUrl + "flashcards";
class FlashcardsService {
    getFlashcards(authorization, nameQuery) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = flashcardsUrl + '?username=' + nameQuery;
            const options = {
                method: 'GET',
                headers: {
                    Authorization: authorization
                }
            };
            const result = yield fetch(url, options);
            const resultJson = yield result.json();
            if (result.status !== 401) {
                return resultJson;
            }
            else {
                window.location.href = "#/login";
            }
        });
    }
    addFlashcard(authorization, question, answer, username) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = flashcardsUrl;
            const options = {
                method: 'POST',
                headers: {
                    authorization: authorization,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    question: question,
                    answer: answer,
                    createDate: new Date().getTime(),
                    username: username,
                })
            };
            const result = yield fetch(url, options);
            if (result.status == 201) {
                return yield result.json();
            }
            else {
                return null;
            }
        });
    }
}


/***/ }),

/***/ "./src/services/LoginService.ts":
/*!**************************************!*\
  !*** ./src/services/LoginService.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "LoginService": () => (/* binding */ LoginService)
/* harmony export */ });
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const baseUrl = 'http://localhost:8080/';
const loginUrl = baseUrl + 'login';
class LoginService {
    login(userName, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: userName,
                    password: password
                })
            };
            const result = yield fetch(loginUrl, options);
            if (result.status == 201) {
                return yield result.json();
            }
            else {
                return undefined;
            }
        });
    }
}


/***/ }),

/***/ "./src/services/SignUpService.ts":
/*!***************************************!*\
  !*** ./src/services/SignUpService.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SignUpService": () => (/* binding */ SignUpService)
/* harmony export */ });
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const baseUrl = 'http://localhost:8080/';
const signupUrl = baseUrl + 'signup';
class SignUpService {
    signup(userName, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const options = {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: userName,
                    password: password,
                })
            };
            const result = yield fetch(signupUrl, options);
            if (result.status == 201) {
                return yield result.json();
            }
            else {
                return undefined;
            }
        });
    }
}


/***/ }),

/***/ "./src/views/FlashcardsView.ts":
/*!*************************************!*\
  !*** ./src/views/FlashcardsView.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "FlashcardsView": () => (/* binding */ FlashcardsView)
/* harmony export */ });
/* harmony import */ var _controllers_FlashcardController__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../controllers/FlashcardController */ "./src/controllers/FlashcardController.ts");

class FlashcardsView {
    constructor() {
        this._currentActiveCard = 0;
        this._cardsEl = [];
    }
    createDOM() {
        const signoutButton = document.createElement("a");
        signoutButton.className = "btn btn-small";
        signoutButton.innerText = "Sign out";
        signoutButton.id = "sign-out";
        signoutButton.setAttribute("href", "#/login");
        signoutButton.addEventListener("click", () => {
            localStorage.clear();
        });
        const bigTitle = document.createElement("h2");
        bigTitle.innerHTML = "Flashcards controller";
        const container = document.createElement("div");
        container.className = "flashcard-listing-component";
        const title = document.createElement("h1");
        title.innerText = "Flashcards";
        const addButton = document.createElement("button");
        addButton.className = "btn btn-small";
        addButton.id = "show";
        addButton.innerText = "Add New Card";
        addButton.addEventListener("click", () => addContainer.classList.add("show"));
        title.appendChild(addButton);
        const cardsContainer = document.createElement("div");
        cardsContainer.className = "cards";
        cardsContainer.id = "cards-container";
        const navigation = document.createElement("div");
        navigation.className = "navigation";
        const prevButton = document.createElement("button");
        prevButton.className = "nav-button";
        prevButton.id = "prev";
        const leftArrow = document.createElement("i");
        leftArrow.className = "fas fa-arrow-left";
        prevButton.appendChild(leftArrow);
        prevButton.addEventListener("click", this.prevButtonClicked.bind(this));
        navigation.appendChild(prevButton);
        const currentPara = document.createElement('p');
        currentPara.id = 'current';
        navigation.appendChild(currentPara);
        const nextButton = document.createElement('button');
        nextButton.className = 'nav-button';
        nextButton.id = 'next';
        const rightArrow = document.createElement('i');
        rightArrow.className = 'fas fa-arrow-right';
        nextButton.appendChild(rightArrow);
        navigation.appendChild(nextButton);
        nextButton.addEventListener('click', this.nextButtonClicked.bind(this));
        const addContainer = document.createElement('div');
        addContainer.className = 'add-container';
        addContainer.id = 'add-container';
        const h1 = document.createElement('h1');
        h1.innerHTML = 'Add New Card';
        addContainer.appendChild(h1);
        const ghostButton = document.createElement('button');
        ghostButton.setAttribute('id', 'hide');
        ghostButton.className = 'btn btn-small btn-ghost';
        const timesIcon = document.createElement('i');
        timesIcon.className = 'fas fa-times';
        ghostButton.appendChild(timesIcon);
        h1.appendChild(ghostButton);
        ghostButton.addEventListener('click', () => addContainer.classList.remove('show'));
        const formGroup1 = document.createElement('div');
        const questionLabel = document.createElement('label');
        formGroup1.className = 'form-group';
        questionLabel.setAttribute('for', 'question');
        formGroup1.appendChild(questionLabel);
        const questionTextArea = document.createElement('textarea');
        questionTextArea.setAttribute('placeholder', 'Enter question');
        questionTextArea.id = 'question';
        formGroup1.appendChild(questionTextArea);
        addContainer.appendChild(formGroup1);
        const formGroup2 = document.createElement('div');
        formGroup2.className = 'form-group';
        const answerLabel = document.createElement('label');
        answerLabel.setAttribute('for', 'answer');
        formGroup2.appendChild(answerLabel);
        const answerTextArea = document.createElement('textarea');
        answerTextArea.setAttribute('placeholder', 'Enter answer');
        answerTextArea.id = 'answer';
        formGroup2.appendChild(answerTextArea);
        addContainer.appendChild(formGroup2);
        const addCardButton = document.createElement('button');
        addCardButton.id = 'add-card';
        addCardButton.className = 'btn';
        const plusIcon = document.createElement('i');
        plusIcon.className = 'fas fa-plus';
        addCardButton.innerText = 'Add Card';
        addCardButton.addEventListener('click', this.addCardButtonClicked.bind(this));
        addCardButton.addEventListener('click', () => addContainer.classList.remove('show'));
        addContainer.appendChild(addCardButton);
        container.appendChild(signoutButton);
        container.appendChild(title);
        container.appendChild(cardsContainer);
        container.appendChild(navigation);
        container.appendChild(addContainer);
        return container;
    }
    listingAdd(flashcard, index) {
        const card = document.createElement("div");
        card.classList.add("card");
        if (index === 0)
            card.className = 'active card';
        const innerCard = document.createElement('div');
        innerCard.className = 'inner-card';
        card.appendChild(innerCard);
        const innerCardFront = document.createElement('div');
        innerCardFront.className = 'inner-card-front';
        innerCard.appendChild(innerCardFront);
        const questionPara = document.createElement('p');
        questionPara.innerText = flashcard.question;
        innerCardFront.appendChild(questionPara);
        const innerCardBack = document.createElement('div');
        innerCardBack.className = 'inner-card-back';
        innerCard.append(innerCardBack);
        const answerPara = document.createElement('p');
        answerPara.innerText = flashcard.answer;
        innerCardBack.appendChild(answerPara);
        const cardsContainer = document.getElementById('cards-container');
        cardsContainer.appendChild(card);
        card.addEventListener('click', () => card.classList.toggle('show-answer'));
        this._cardsEl.push(card);
        this.updateCurrentText.call(this);
    }
    updateCurrentText() {
        const currentEl = document.getElementById('current');
        currentEl.innerText = `${this._currentActiveCard + 1}/${this._cardsEl.length}`;
    }
    nextButtonClicked() {
        this._cardsEl[this._currentActiveCard].className = 'card left';
        this._currentActiveCard = this._currentActiveCard + 1;
        if (this._currentActiveCard > this._cardsEl.length - 1) {
            this._currentActiveCard = this._cardsEl.length - 1;
        }
        this._cardsEl[this._currentActiveCard].className = 'card active';
        this.updateCurrentText.call(this);
    }
    prevButtonClicked() {
        this._cardsEl[this._currentActiveCard].className = 'card right';
        this._currentActiveCard = this._currentActiveCard - 1;
        if (this._currentActiveCard < 0) {
            this._currentActiveCard = 0;
        }
        this._cardsEl[this._currentActiveCard].className = 'card active';
        this.updateCurrentText.call(this);
    }
    addCardButtonClicked() {
        const flashcardsController = new _controllers_FlashcardController__WEBPACK_IMPORTED_MODULE_0__.FlashcardsController();
        const question = document.getElementById('question').value;
        const answer = document.getElementById('answer').value;
        flashcardsController.addData(question, answer);
    }
    listingClear() {
        const container = document.getElementById('cards-container');
        if (!container) {
            return;
        }
        while (container.children.length > 0) {
            container.removeChild(container.children[0]);
        }
        this._cardsEl = [];
        this._currentActiveCard = 0;
        const nextButton = document.getElementById("next");
        nextButton.addEventListener('click', this.nextButtonClicked.bind(this));
        const prevButton = document.getElementById("prev");
        prevButton.addEventListener('click', this.prevButtonClicked.bind(this));
    }
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!*********************!*\
  !*** ./src/Main.ts ***!
  \*********************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Main": () => (/* binding */ Main)
/* harmony export */ });
/* harmony import */ var _Router__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Router */ "./src/Router.ts");

class Main {
    constructor() {
        this.router = new _Router__WEBPACK_IMPORTED_MODULE_0__.HashRouter();
        console.log(`Constructored new Instance of the program`);
    }
    launchApp() {
        const localToken = JSON.parse(localStorage.getItem('currentUser'));
        let container = document.getElementById("main-container");
        this.router.registerIndex(() => (this.router.homepageView()));
        this.router.register("/login", () => (this.router.switchToLoginView()));
        if (localToken !== null) {
            this.router.register("/flashcards", () => (this.router.switchToFlashcardsView(localToken.token)));
        }
        else {
            this.router.register("/flashcards", () => (this.router.switchToLoginView()));
        }
        // this.router.register("/page3", () => (container.innerHTML = "page3"));
        // this.router.register("/page4", () => {
        //   throw new Error("error");
        // });
        this.router.load();
        this.router.registerNotFound(() => (container.innerHTML = "not found"));
        // this.router.registerError(
        //   (e) => (container.innerHTML = "Error message：<br>" + e.message)
        // );
    }
}
new Main().launchApp();

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9tYW5hZ2V1aS8uL3NyYy9Sb3V0ZXIudHMiLCJ3ZWJwYWNrOi8vbWFuYWdldWkvLi9zcmMvY29udHJvbGxlcnMvQmFzZUNvbnRyb2xsZXIudHMiLCJ3ZWJwYWNrOi8vbWFuYWdldWkvLi9zcmMvY29udHJvbGxlcnMvRmxhc2hjYXJkQ29udHJvbGxlci50cyIsIndlYnBhY2s6Ly9tYW5hZ2V1aS8uL3NyYy9jb250cm9sbGVycy9Mb2dpbkNvbnRyb2xsZXIudHMiLCJ3ZWJwYWNrOi8vbWFuYWdldWkvLi9zcmMvY29udHJvbGxlcnMvTWFpbkNvbnRyb2xsZXIudHMiLCJ3ZWJwYWNrOi8vbWFuYWdldWkvLi9zcmMvc2VydmljZXMvRmxhc2hjYXJkc1NlcnZpY2UudHMiLCJ3ZWJwYWNrOi8vbWFuYWdldWkvLi9zcmMvc2VydmljZXMvTG9naW5TZXJ2aWNlLnRzIiwid2VicGFjazovL21hbmFnZXVpLy4vc3JjL3NlcnZpY2VzL1NpZ25VcFNlcnZpY2UudHMiLCJ3ZWJwYWNrOi8vbWFuYWdldWkvLi9zcmMvdmlld3MvRmxhc2hjYXJkc1ZpZXcudHMiLCJ3ZWJwYWNrOi8vbWFuYWdldWkvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vbWFuYWdldWkvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL21hbmFnZXVpL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vbWFuYWdldWkvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9tYW5hZ2V1aS8uL3NyYy9NYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQThEO0FBQ0U7QUFFUztBQUVsRSxNQUFNLFVBQVU7SUFHbkI7UUFGUSxnQkFBVyxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztRQUc1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cyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE1haW5Db250cm9sbGVyIH0gZnJvbSBcIi4vY29udHJvbGxlcnMvTWFpbkNvbnRyb2xsZXJcIjtcbmltcG9ydCB7IExvZ2luQ29udHJvbGxlciB9IGZyb20gXCIuL2NvbnRyb2xsZXJzL0xvZ2luQ29udHJvbGxlclwiO1xuaW1wb3J0IHsgU2Vzc2lvblRva2VuIH0gZnJvbSBcIi4vbW9kZWxzL0F1dGhlbnRpY2F0aW9uTW9kZWxzXCI7XG5pbXBvcnQgeyBGbGFzaGNhcmRzQ29udHJvbGxlciB9IGZyb20gXCIuL2NvbnRyb2xsZXJzL0ZsYXNoY2FyZENvbnRyb2xsZXJcIjtcblxuZXhwb3J0IGNsYXNzIEhhc2hSb3V0ZXIge1xuICAgIHByaXZhdGUgbWFpbkVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWFpbi1jb250YWluZXInKTtcbiAgICBwcml2YXRlIHJvdXRlcnM6IGFueTtcbiAgICBjb25zdHJ1Y3Rvcigpe1xuICAgICAgICB0aGlzLnJvdXRlcnMgPSB7fTtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2hhc2hjaGFuZ2UnLHRoaXMubG9hZC5iaW5kKHRoaXMpLCBmYWxzZSlcbiAgICB9XG4gXG4gICAgcmVnaXN0ZXIoaGFzaDogc3RyaW5nLCBjYWxsYmFjayA9IGZ1bmN0aW9uKCl7fSl7XG4gICAgICAgIHRoaXMucm91dGVyc1toYXNoXSA9IGNhbGxiYWNrO1xuICAgIH1cbiAgIFxuICAgIHJlZ2lzdGVySW5kZXgoY2FsbGJhY2sgPSBmdW5jdGlvbigpe30pe1xuICAgICAgICB0aGlzLnJvdXRlcnNbJ2luZGV4J10gPSBjYWxsYmFjaztcbiAgICB9XG4gICBcbiAgICByZWdpc3Rlck5vdEZvdW5kKGNhbGxiYWNrID0gZnVuY3Rpb24oKXt9KXtcbiAgICAgICAgdGhpcy5yb3V0ZXJzWyc0MDQnXSA9IGNhbGxiYWNrO1xuICAgIH1cbiBcbiAgICByZWdpc3RlckVycm9yKGNhbGxiYWNrID0gZnVuY3Rpb24oKXt9KXtcbiAgICAgICAgdGhpcy5yb3V0ZXJzWydlcnJvciddID0gY2FsbGJhY2s7XG4gICAgfVxuICBcbiAgICBsb2FkKCl7XG4gICAgICAgIGxldCBoYXNoID0gbG9jYXRpb24uaGFzaC5zbGljZSgxKTtcbiAgICAgICAgbGV0IGhhbmRsZXI7XG4gICAgICBcbiAgICAgICAgaWYoIWhhc2gpe1xuICAgICAgICAgICAgaGFuZGxlciA9IHRoaXMucm91dGVycy5pbmRleDtcbiAgICAgICAgfSBlbHNlIGlmKCF0aGlzLnJvdXRlcnMuaGFzT3duUHJvcGVydHkoaGFzaCkpe1xuICAgICAgICAgICAgaGFuZGxlciA9IHRoaXMucm91dGVyc1snNDA0J10gfHwgZnVuY3Rpb24oKXt9O1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgaGFuZGxlciA9IHRoaXMucm91dGVyc1toYXNoXVxuICAgICAgICB9XG4gICAgICBcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGhhbmRsZXIuYXBwbHkodGhpcyk7XG4gICAgICAgIH0gY2F0Y2goZSl7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBzd2l0Y2hUb0xvZ2luVmlldygpIHtcbiAgICAgICAgaWYgKHRoaXMubWFpbkVsZW1lbnQpIHtcbiAgICAgICAgICAgIHRoaXMubWFpbkVsZW1lbnQuaW5uZXJIVE1MID0gXCJcIjtcbiAgICAgICAgICAgIGNvbnN0IGxvZ2luQ29udHJvbGxlcjogTG9naW5Db250cm9sbGVyID0gbmV3IExvZ2luQ29udHJvbGxlcigpO1xuICAgICAgICAgICAgdGhpcy5tYWluRWxlbWVudC5hcHBlbmQobG9naW5Db250cm9sbGVyLmNyZWF0ZVZpZXcoKSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgaG9tZXBhZ2VWaWV3KCkge1xuICAgICAgICBpZih0aGlzLm1haW5FbGVtZW50KSB7XG4gICAgICAgICAgICB0aGlzLm1haW5FbGVtZW50LmlubmVySFRNTCA9IFwiXCI7XG4gICAgICAgICAgICBjb25zdCBtYWluQ29udHJvbGxlcjogTWFpbkNvbnRyb2xsZXIgPSBuZXcgTWFpbkNvbnRyb2xsZXIoKTtcbiAgICAgICAgICAgIHRoaXMubWFpbkVsZW1lbnQuYXBwZW5kKG1haW5Db250cm9sbGVyLmNyZWF0ZVZpZXcoKSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgc3dpdGNoVG9GbGFzaGNhcmRzVmlldyhzZXNzaW9uVG9rZW46IFNlc3Npb25Ub2tlbiB8IHVuZGVmaW5lZCkge1xuICAgICAgICBpZiAoIXNlc3Npb25Ub2tlbikgcmV0dXJuO1xuICAgIFxuICAgICAgICBpZiAodGhpcy5tYWluRWxlbWVudCkge1xuICAgICAgICAgICAgdGhpcy5tYWluRWxlbWVudC5pbm5lckhUTUwgPSBcIlwiO1xuICAgICAgICAgICAgY29uc3QgZmxhc2hjYXJkc0NvbnRyb2xsZXIgPSBuZXcgRmxhc2hjYXJkc0NvbnRyb2xsZXIoKTtcbiAgICAgICAgICAgIGlmIChzZXNzaW9uVG9rZW4pIHtcbiAgICAgICAgICAgICAgICBmbGFzaGNhcmRzQ29udHJvbGxlci5zZXRTZXNzaW9uVG9rZW4oc2Vzc2lvblRva2VuKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5tYWluRWxlbWVudC5hcHBlbmQoZmxhc2hjYXJkc0NvbnRyb2xsZXIuY3JlYXRlVmlldygpKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuXG5cblxuXG5cblxuXG4iLCJleHBvcnQgYWJzdHJhY3QgY2xhc3MgQmFzZUNvbnRyb2xsZXIge1xuICAgIHByb3RlY3RlZCBjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgXG4gICAgcHJvdGVjdGVkIGNyZWF0ZUVsZW1lbnQ8SyBleHRlbmRzIGtleW9mIEhUTUxFbGVtZW50VGFnTmFtZU1hcD4oXG4gICAgICAgIGVsZW1lbnRUeXBlOiBLLCBpbm5lclRleHQ/OiBzdHJpbmcsIGFjdGlvbj86YW55XG4gICAgKTogSFRNTEVsZW1lbnRUYWdOYW1lTWFwW0tdIHtcbiAgICAgICAgY29uc3QgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoZWxlbWVudFR5cGUpO1xuICAgICAgICBpZiAoaW5uZXJUZXh0KSB7XG4gICAgICAgICAgICBlbGVtZW50LmlubmVyVGV4dCA9IGlubmVyVGV4dDtcbiAgICAgICAgfVxuICAgICAgICBpZihhY3Rpb24pIHtcbiAgICAgICAgICAgIGVsZW1lbnQub25jbGljayA9IGFjdGlvbjtcblxuICAgICAgICB9XG4gICAgICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZChlbGVtZW50KVxuICAgICAgICByZXR1cm4gZWxlbWVudDtcbiAgICB9XG59IiwiaW1wb3J0IHsgU2Vzc2lvblRva2VuLCBBY2Nlc3NSaWdodCB9IGZyb20gXCIuLi9tb2RlbHMvQXV0aGVudGljYXRpb25Nb2RlbHNcIjtcbmltcG9ydCB7IEZsYXNoY2FyZHNTZXJ2aWNlIH0gZnJvbSBcIi4uL3NlcnZpY2VzL0ZsYXNoY2FyZHNTZXJ2aWNlXCI7XG5pbXBvcnQgeyBGbGFzaGNhcmRzVmlldyB9IGZyb20gXCIuLi92aWV3cy9GbGFzaGNhcmRzVmlld1wiO1xuaW1wb3J0IHsgRmxhc2hjYXJkIH0gZnJvbSBcIi4uL21vZGVscy9EYXRhTW9kZWxzXCI7XG5cblxuZXhwb3J0IGNsYXNzIEZsYXNoY2FyZHNDb250cm9sbGVyIHtcbiAgICBwcml2YXRlIHNlc3Npb25Ub2tlbjogU2Vzc2lvblRva2VuIHwgdW5kZWZpbmVkO1xuICAgIHByaXZhdGUgZmxhc2hjYXJkc1NlcnZpY2U6IEZsYXNoY2FyZHNTZXJ2aWNlID0gbmV3IEZsYXNoY2FyZHNTZXJ2aWNlKCk7XG4gICAgcHJpdmF0ZSBmbGFzaGNhcmRzVmlldzogRmxhc2hjYXJkc1ZpZXcgPSBuZXcgRmxhc2hjYXJkc1ZpZXcoKTtcbiAgXG4gICAgcHVibGljIHNldFNlc3Npb25Ub2tlbihzZXNzaW9uVG9rZW46IFNlc3Npb25Ub2tlbikge1xuICAgICAgICB0aGlzLnNlc3Npb25Ub2tlbiA9IHNlc3Npb25Ub2tlbjtcbiAgICB9XG4gIFxuICAgIHB1YmxpYyAgY3JlYXRlVmlldyAoKTogSFRNTERpdkVsZW1lbnQge1xuXG4gICAgICAgIGlmICh0aGlzLnNlc3Npb25Ub2tlbikgeyAgICBcbiAgICAgICAgICAgIHRoaXMuZmxhc2hjYXJkc1ZpZXcuY3JlYXRlRE9NKCk7XG4gICAgICAgICAgICB0aGlzLmdldERhdGEoKVxuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ2N1cnJlbnRVc2VyJywgSlNPTi5zdHJpbmdpZnkoeyB0b2tlbjogdGhpcy5zZXNzaW9uVG9rZW4gfSkpO1xuICAgIFxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5mbGFzaGNhcmRzVmlldy5jcmVhdGVET00oKTtcbiAgICAgICAgfSBcbiAgICAgICAgXG4gICAgICAgIHJldHVybiAgdGhpcy5mbGFzaGNhcmRzVmlldy5jcmVhdGVET00oKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgZ2V0RGF0YSgpIHtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgY29uc3QgZmxhc2hjYXJkc0RhdGEgPSBhd2FpdCB0aGlzLmZsYXNoY2FyZHNTZXJ2aWNlLmdldEZsYXNoY2FyZHMoIFxuICAgICAgICAgICAgdGhpcy5zZXNzaW9uVG9rZW4hLnRva2VuSWQsXG4gICAgICAgICAgICB0aGlzLnNlc3Npb25Ub2tlbiEudXNlcm5hbWUsXG4gICAgICAgIClcblxuICAgICAgICBjb25zb2xlLmxvZyhmbGFzaGNhcmRzRGF0YSk7XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAgZmxhc2hjYXJkc0RhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IGZsYWhjYXJkOiBGbGFzaGNhcmQgPSB7XG4gICAgICAgICAgICAgICAgcXVlc3Rpb24gIDogZmxhc2hjYXJkc0RhdGFbaV0ucXVlc3Rpb24sXG4gICAgICAgICAgICAgICAgYW5zd2VyICAgIDogZmxhc2hjYXJkc0RhdGFbaV0uYW5zd2VyLFxuICAgICAgICAgICAgICAgIGlzQWN0aXZlICA6IGZhbHNlLFxuICAgICAgICAgICAgICAgIF9pZCAgICAgICA6IGZsYXNoY2FyZHNEYXRhW2ldLl9pZCxcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5mbGFzaGNhcmRzVmlldy5saXN0aW5nQWRkKGZsYWhjYXJkLCBpKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIGFkZERhdGEocXVlc3Rpb246c3RyaW5nLCBhbnN3ZXI6c3RyaW5nKSB7XG4gICBcbiAgICAgICAgY29uc3QgbG9jYWxUb2tlbiA9ICBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdjdXJyZW50VXNlcicpISk7XG4gICAgICAgIGNvbnN0IGFkZEZsYXNoY2FyZHNEYXRhID0gYXdhaXQgdGhpcy5mbGFzaGNhcmRzU2VydmljZS5hZGRGbGFzaGNhcmQoIFxuICAgICAgICAgICAgbG9jYWxUb2tlbi50b2tlbi50b2tlbklkLFxuICAgICAgICAgICAgcXVlc3Rpb24sIFxuICAgICAgICAgICAgYW5zd2VyLCBcbiAgICAgICAgICAgIGxvY2FsVG9rZW4udG9rZW4udXNlcm5hbWUsXG4gICAgICAgICk7XG4gICAgICAgXG4gICAgICAgIHRoaXMuZmxhc2hjYXJkc1ZpZXcubGlzdGluZ0NsZWFyKCk7XG4gICAgICAgXG4gICAgICAgIGNvbnN0IGZsYXNoY2FyZHNEYXRhID0gYXdhaXQgdGhpcy5mbGFzaGNhcmRzU2VydmljZS5nZXRGbGFzaGNhcmRzKCBcbiAgICAgICAgICAgIGxvY2FsVG9rZW4udG9rZW4udG9rZW5JZCxcbiAgICAgICAgICAgIGxvY2FsVG9rZW4udG9rZW4udXNlcm5hbWUsXG4gICAgICAgIClcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8ICBmbGFzaGNhcmRzRGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgZmxhaGNhcmQ6IEZsYXNoY2FyZCA9IHtcbiAgICAgICAgICAgICAgICBxdWVzdGlvbiAgOiBmbGFzaGNhcmRzRGF0YVtpXS5xdWVzdGlvbixcbiAgICAgICAgICAgICAgICBhbnN3ZXIgICAgOiBmbGFzaGNhcmRzRGF0YVtpXS5hbnN3ZXIsXG4gICAgICAgICAgICAgICAgaXNBY3RpdmUgIDogZmFsc2UsXG4gICAgICAgICAgICAgICAgX2lkICAgICAgIDogZmxhc2hjYXJkc0RhdGFbaV0uX2lkLFxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLmZsYXNoY2FyZHNWaWV3Lmxpc3RpbmdBZGQoZmxhaGNhcmQsIGkpXG4gICAgICAgIH1cblxuICAgIH1cbn0iLCJpbXBvcnQgeyBMb2dpblNlcnZpY2UgfSBmcm9tIFwiLi4vc2VydmljZXMvTG9naW5TZXJ2aWNlXCI7XG5pbXBvcnQgeyBIYXNoUm91dGVyIH0gZnJvbSBcIi4uL1JvdXRlclwiXG5cbmV4cG9ydCBjbGFzcyBMb2dpbkNvbnRyb2xsZXIgIHtcbiAgICBwcml2YXRlIGxvZ2luU2VydmljZSA9IG5ldyBMb2dpblNlcnZpY2UoKVxuICAgIHByaXZhdGUgcm91dGVyID0gbmV3IEhhc2hSb3V0ZXIoKTtcblxuICAgIHByaXZhdGUgYXN5bmMgbG9naW5CdXR0b25DbGlja2VkKHVzZXJuYW1lOiBhbnksIHBhc3N3b3JkOiBhbnksICBldmVudDogYW55KXtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgaWYgKHVzZXJuYW1lLnZhbHVlICYmICBwYXNzd29yZC52YWx1ZSkge1xuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gIGF3YWl0IHRoaXMubG9naW5TZXJ2aWNlLmxvZ2luKHVzZXJuYW1lLnZhbHVlLCBwYXNzd29yZC52YWx1ZSlcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHJlc3VsdClcbiAgICAgICAgICAgIGlmKHJlc3VsdCkge1xuICAgICAgICAgICAgICAgIHRoaXMucm91dGVyLnN3aXRjaFRvRmxhc2hjYXJkc1ZpZXcocmVzdWx0KVxuICAgICAgICAgICAgICAgIHdpbmRvdy5oaXN0b3J5LnB1c2hTdGF0ZShcIm9iamVjdCBvciBzdHJpbmdcIiwgXCJGbGFzaGNhcmRzXCIsIFwiIy9mbGFzaGNhcmRzXCIpO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBUT0RPIHNob3dFcnJvckxhYmVsXG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBUT0RPIHNob3dFcnJvckxhYmVsXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgY3JlYXRlVmlldygpOiBIVE1MRGl2RWxlbWVudCB7XG4gICAgICAgIGNvbnN0IGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIGNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKFwiY29udGFpbmVyXCIpO1xuXG4gICAgICAgIGNvbnN0IGxvZ2luRm9ybSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJmb3JtXCIpO1xuICAgICAgICBsb2dpbkZvcm0uY2xhc3NMaXN0LmFkZChcImZvcm1cIik7XG4gICAgICAgIGxvZ2luRm9ybS5zZXRBdHRyaWJ1dGUoXCJpZFwiLCBcImZvcm1cIik7XG5cbiAgICAgICAgY29uc3QgdXNlcm5hbWVMb2dpbkZvcm1Db250cm9sID0gIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIHVzZXJuYW1lTG9naW5Gb3JtQ29udHJvbC5jbGFzc0xpc3QuYWRkKFwiZm9ybS1jb250cm9sXCIpO1xuICAgICAgICBjb25zdCB1c2VybmFtZUxhYmVsID0gIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsYWJlbFwiKTtcbiAgICAgICAgdXNlcm5hbWVMYWJlbC5zZXRBdHRyaWJ1dGUoXCJmb3JcIiwgXCJ1c2VybmFtZVwiKTtcbiAgICAgICAgdXNlcm5hbWVMYWJlbC5pbm5lclRleHQgPSBcIlVzZXJuYW1lXCI7XG4gICAgICAgIGNvbnN0IHVzZXJuYW1lSW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XG4gICAgICAgIHVzZXJuYW1lSW5wdXQuc2V0QXR0cmlidXRlKFwidHlwZVwiLCBcInRleHRcIik7XG4gICAgICAgIHVzZXJuYW1lSW5wdXQuc2V0QXR0cmlidXRlKFwiaWRcIiwgXCJ1c2VybmFtZVwiKTtcbiAgICAgICAgY29uc3QgdXNlcm5hbWVFcnJvck1lc3NhZ2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic21hbGxcIik7XG4gICAgICAgIHVzZXJuYW1lRXJyb3JNZXNzYWdlLmlubmVySFRNTCA9IFwiRXJyb3IgbWVzc2FnZVwiO1xuICAgICAgICB1c2VybmFtZUxvZ2luRm9ybUNvbnRyb2wuYXBwZW5kKCB1c2VybmFtZUxhYmVsLCB1c2VybmFtZUlucHV0LCB1c2VybmFtZUVycm9yTWVzc2FnZSk7XG5cbiAgICAgICAgY29uc3QgcGFzc3dvcmRGb3JtQ29udHJvbCA9ICBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICBwYXNzd29yZEZvcm1Db250cm9sLmNsYXNzTGlzdC5hZGQoXCJmb3JtLWNvbnRyb2xcIik7XG4gICAgICAgIGNvbnN0IHBhc3N3b3JkTGFiZWwgPSAgZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxhYmVsXCIpO1xuICAgICAgICBwYXNzd29yZExhYmVsLnNldEF0dHJpYnV0ZShcImZvclwiLCBcInBhc3N3b3JkXCIpO1xuICAgICAgICBwYXNzd29yZExhYmVsLmlubmVyVGV4dCA9IFwiUGFzc3dvcmRcIjtcbiAgICAgICAgY29uc3QgcGFzc3dvcmRJbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKTtcbiAgICAgICAgcGFzc3dvcmRJbnB1dC5zZXRBdHRyaWJ1dGUoXCJ0eXBlXCIsIFwicGFzc3dvcmRcIik7XG4gICAgICAgIHBhc3N3b3JkSW5wdXQuc2V0QXR0cmlidXRlKFwiaWRcIiwgXCJwYXNzd29yZFwiKTtcbiAgICAgICAgY29uc3QgcGFzc3dvcmRFcnJvck1lc3NhZ2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic21hbGxcIik7XG4gICAgICAgIHBhc3N3b3JkRXJyb3JNZXNzYWdlLmlubmVySFRNTCA9IFwiRXJyb3IgbWVzc2FnZVwiO1xuICAgICAgICBwYXNzd29yZEZvcm1Db250cm9sLmFwcGVuZCggcGFzc3dvcmRMYWJlbCwgcGFzc3dvcmRJbnB1dCwgcGFzc3dvcmRFcnJvck1lc3NhZ2UpO1xuXG4gICAgICAgIGxvZ2luRm9ybS5hcHBlbmQodXNlcm5hbWVMb2dpbkZvcm1Db250cm9sLCBwYXNzd29yZEZvcm1Db250cm9sKVxuXG4gICAgICAgIGNvbnN0IGxvZ2luQnV0dG9uID0gIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XG4gICAgICAgIGxvZ2luQnV0dG9uLmlubmVySFRNTCA9IFwiTG9nIGluXCI7XG4gICAgICAgIGxvZ2luQnV0dG9uLnNldEF0dHJpYnV0ZShcInR5cGVcIiwgXCJzdWJtaXRcIik7XG4gICAgICAgIGxvZ2luQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJyx0aGlzLmxvZ2luQnV0dG9uQ2xpY2tlZC5iaW5kKHRoaXMsIHVzZXJuYW1lSW5wdXQscGFzc3dvcmRJbnB1dCkpXG5cbiAgICAgICAgY29uc3Qgc2lnbnVwTGluayA9ICBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG4gICAgICAgIHNpZ251cExpbmsuaW5uZXJIVE1MID0gXCJTaWduIHVwXCJcblxuICAgICAgICBzaWdudXBMaW5rLmNsYXNzTGlzdC5hZGQoXCJsaW5rXCIpO1xuICAgICAgICBzaWdudXBMaW5rLnNldEF0dHJpYnV0ZShcImhyZWZcIiwgXCJcIik7XG5cblxuXG4gICAgICAgIGxvZ2luRm9ybS5hcHBlbmQodXNlcm5hbWVMb2dpbkZvcm1Db250cm9sLCBwYXNzd29yZEZvcm1Db250cm9sLCBsb2dpbkJ1dHRvbiwgc2lnbnVwTGluaylcblxuICAgICAgICBjb250YWluZXIuYXBwZW5kKGxvZ2luRm9ybSk7XG5cbiAgICAgICAgcmV0dXJuIGNvbnRhaW5lcjtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBTaWduVXBTZXJ2aWNlIH0gZnJvbSBcIi4uL3NlcnZpY2VzL1NpZ25VcFNlcnZpY2VcIjtcbmltcG9ydCB7IEhhc2hSb3V0ZXIgfSBmcm9tIFwiLi4vUm91dGVyXCJcbmltcG9ydCB7IEJhc2VDb250cm9sbGVyIH0gZnJvbSBcIi4vQmFzZUNvbnRyb2xsZXJcIjtcblxuZXhwb3J0IGNsYXNzIE1haW5Db250cm9sbGVyIGV4dGVuZHMgQmFzZUNvbnRyb2xsZXIge1xuXG4gICAgcHJpdmF0ZSBzaWdudXBTZXJ2aWNlID0gbmV3IFNpZ25VcFNlcnZpY2UoKTtcbiAgICBwcml2YXRlIHJvdXRlciA9IG5ldyBIYXNoUm91dGVyKCk7XG5cbiAgICBwcml2YXRlIGFzeW5jIHNpZ251cEJ1dHRvbkNsaWNrZWQoXG4gICAgICAgIHVzZXJuYW1lIDogSFRNTElucHV0RWxlbWVudCwgXG4gICAgICAgIGVtYWlsICAgIDogSFRNTElucHV0RWxlbWVudCxcbiAgICAgICAgcGFzc3dvcmQxOiBIVE1MSW5wdXRFbGVtZW50LCBcbiAgICAgICAgcGFzc3dvcmQyOiBIVE1MSW5wdXRFbGVtZW50LFxuICAgICAgICBldmVudCAgICA6IE1vdXNlRXZlbnQpIHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICBpZighdGhpcy5jaGVja1JlcXVpcmVkKFt1c2VybmFtZSwgZW1haWwsIHBhc3N3b3JkMSwgcGFzc3dvcmQyXSkpe1xuICAgICAgICAgICAgaWYodGhpcy5jaGVja0VtYWlsKGVtYWlsKSkge307XG4gICAgICAgICAgICBpZih0aGlzLmNoZWNrUGFzc3dvcmRzTWF0Y2gocGFzc3dvcmQxLCBwYXNzd29yZDIpKXt9O1xuICAgICAgICB9IFxuICAgIFxuICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCB0aGlzLnNpZ251cFNlcnZpY2Uuc2lnbnVwKHVzZXJuYW1lLnZhbHVlLCBwYXNzd29yZDEudmFsdWUpO1xuXG4gICAgICAgIGlmICh1c2VybmFtZS52YWx1ZSAmJiBwYXNzd29yZDEudmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMucm91dGVyLnN3aXRjaFRvRmxhc2hjYXJkc1ZpZXcocmVzdWx0KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBjcmVhdGVWaWV3KCk6IEhUTUxEaXZFbGVtZW50IHtcbiAgICAgICAgY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJjb250YWluZXJcIik7XG4gICAgICAgIGNvbnN0IHJlZ2lzdGVyRm9ybSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJmb3JtXCIpO1xuICAgICAgICByZWdpc3RlckZvcm0uY2xhc3NMaXN0LmFkZChcImZvcm1cIik7XG4gICAgICAgIHJlZ2lzdGVyRm9ybS5zZXRBdHRyaWJ1dGUoXCJpZFwiLCBcImZvcm1cIik7XG5cbiAgICAgICAgY29uc3QgdXNlcm5hbWVSZWdpc3RlckZvcm1Db250cm9sID0gIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIHVzZXJuYW1lUmVnaXN0ZXJGb3JtQ29udHJvbC5jbGFzc0xpc3QuYWRkKFwiZm9ybS1jb250cm9sXCIpO1xuICAgICAgICBjb25zdCB1c2VybmFtZUxhYmVsID0gIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsYWJlbFwiKTtcbiAgICAgICAgdXNlcm5hbWVMYWJlbC5zZXRBdHRyaWJ1dGUoXCJmb3JcIiwgXCJ1c2VybmFtZVwiKTtcbiAgICAgICAgdXNlcm5hbWVMYWJlbC5pbm5lclRleHQgPSBcIlVzZXJuYW1lXCI7XG4gICAgICAgIGNvbnN0IHVzZXJuYW1lSW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XG4gICAgICAgIHVzZXJuYW1lSW5wdXQuc2V0QXR0cmlidXRlKFwidHlwZVwiLCBcInRleHRcIik7XG4gICAgICAgIHVzZXJuYW1lSW5wdXQuc2V0QXR0cmlidXRlKFwiaWRcIiwgXCJ1c2VybmFtZVwiKTtcbiAgICAgICAgY29uc3QgdXNlcm5hbWVFcnJvck1lc3NhZ2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic21hbGxcIik7XG4gICAgICAgIHVzZXJuYW1lRXJyb3JNZXNzYWdlLmlubmVySFRNTCA9IFwiRXJyb3IgbWVzc2FnZVwiO1xuICAgICAgICB1c2VybmFtZVJlZ2lzdGVyRm9ybUNvbnRyb2wuYXBwZW5kKCB1c2VybmFtZUxhYmVsLCB1c2VybmFtZUlucHV0LCB1c2VybmFtZUVycm9yTWVzc2FnZSk7XG5cbiAgICAgICAgY29uc3QgZW1haWxSZWdpc3RlckZvcm1Db250cm9sID0gIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIilcbiAgICAgICAgZW1haWxSZWdpc3RlckZvcm1Db250cm9sLmNsYXNzTGlzdC5hZGQoXCJmb3JtLWNvbnRyb2xcIik7XG4gICAgICAgIGNvbnN0IGVtYWlsTGFiZWwgPSAgZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxhYmVsXCIpO1xuICAgICAgICBlbWFpbExhYmVsLnNldEF0dHJpYnV0ZShcImZvclwiLCBcImVtYWlsXCIpO1xuICAgICAgICBlbWFpbExhYmVsLmlubmVyVGV4dCA9IFwiRW1haWxcIjtcbiAgICAgICAgY29uc3QgZW1haWxJbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKTtcbiAgICAgICAgZW1haWxJbnB1dC5zZXRBdHRyaWJ1dGUoXCJ0eXBlXCIsIFwidGV4dFwiKTtcbiAgICAgICAgZW1haWxJbnB1dC5zZXRBdHRyaWJ1dGUoXCJpZFwiLCBcImVtYWlsXCIpO1xuICAgICAgICBjb25zdCBlbWFpbEVycm9yTWVzc2FnZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzbWFsbFwiKTtcbiAgICAgICAgZW1haWxFcnJvck1lc3NhZ2UuaW5uZXJIVE1MID0gXCJFcnJvciBtZXNzYWdlXCI7XG4gICAgICAgIGVtYWlsUmVnaXN0ZXJGb3JtQ29udHJvbC5hcHBlbmQoZW1haWxMYWJlbCwgZW1haWxJbnB1dCwgZW1haWxFcnJvck1lc3NhZ2UpO1xuXG4gICAgICAgIGNvbnN0IHBhc3N3b3JkMVJlZ2lzdGVyRm9ybUNvbnRyb2wgPSAgZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKVxuICAgICAgICBwYXNzd29yZDFSZWdpc3RlckZvcm1Db250cm9sIC5jbGFzc0xpc3QuYWRkKFwiZm9ybS1jb250cm9sXCIpO1xuICAgICAgICBjb25zdCBwYXNzd29yZDFMYWJlbCA9ICBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGFiZWxcIik7XG4gICAgICAgIHBhc3N3b3JkMUxhYmVsLnNldEF0dHJpYnV0ZShcImZvclwiLCBcInBhc3N3b3JkXCIpO1xuICAgICAgICBwYXNzd29yZDFMYWJlbC5pbm5lclRleHQgPSBcIlBhc3N3b3JkXCI7XG4gICAgICAgIGNvbnN0IHBhc3N3b3JkMUlucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpO1xuICAgICAgICBwYXNzd29yZDFJbnB1dC5zZXRBdHRyaWJ1dGUoXCJ0eXBlXCIsIFwicGFzc3dvcmRcIik7XG4gICAgICAgIHBhc3N3b3JkMUlucHV0LnNldEF0dHJpYnV0ZShcImlkXCIsIFwicGFzc3dvcmQxXCIpO1xuICAgICAgICBjb25zdCBwYXNzd29yZDFFcnJvck1lc3NhZ2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic21hbGxcIik7XG4gICAgICAgIHBhc3N3b3JkMUVycm9yTWVzc2FnZS5pbm5lckhUTUwgPSBcIkVycm9yIG1lc3NhZ2VcIjtcbiAgICAgICAgcGFzc3dvcmQxUmVnaXN0ZXJGb3JtQ29udHJvbC5hcHBlbmQocGFzc3dvcmQxTGFiZWwsICBwYXNzd29yZDFJbnB1dCwgcGFzc3dvcmQxRXJyb3JNZXNzYWdlKTtcblxuICAgICAgICBjb25zdCBwYXNzd29yZDJSZWdpc3RlckZvcm1Db250cm9sID0gIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIilcbiAgICAgICAgcGFzc3dvcmQyUmVnaXN0ZXJGb3JtQ29udHJvbCAuY2xhc3NMaXN0LmFkZChcImZvcm0tY29udHJvbFwiKTtcbiAgICAgICAgY29uc3QgcGFzc3dvcmQyTGFiZWwgPSAgZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxhYmVsXCIpO1xuICAgICAgICBwYXNzd29yZDJMYWJlbC5zZXRBdHRyaWJ1dGUoXCJmb3JcIiwgXCJwYXNzd29yZFwiKTtcbiAgICAgICAgcGFzc3dvcmQyTGFiZWwuaW5uZXJUZXh0ID0gXCJDb25maXJtIFBhc3N3b3JkXCI7XG4gICAgICAgIGNvbnN0IHBhc3N3b3JkMklucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpO1xuICAgICAgICBwYXNzd29yZDJJbnB1dC5zZXRBdHRyaWJ1dGUoXCJ0eXBlXCIsIFwicGFzc3dvcmRcIik7XG4gICAgICAgIHBhc3N3b3JkMklucHV0LnNldEF0dHJpYnV0ZShcImlkXCIsIFwicGFzc3dvcmQyXCIpO1xuICAgICAgICBjb25zdCBwYXNzd29yZDJFcnJvck1lc3NhZ2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic21hbGxcIik7XG4gICAgICAgIHBhc3N3b3JkMkVycm9yTWVzc2FnZS5pbm5lckhUTUwgPSBcIkVycm9yIG1lc3NhZ2VcIjtcbiAgICAgICAgcGFzc3dvcmQyUmVnaXN0ZXJGb3JtQ29udHJvbC5hcHBlbmQocGFzc3dvcmQyTGFiZWwsICBwYXNzd29yZDJJbnB1dCwgcGFzc3dvcmQyRXJyb3JNZXNzYWdlKTtcblxuICAgICAgICBjb25zdCBzdWJtaXRCdXR0b24gPSAgZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcbiAgICAgICAgc3VibWl0QnV0dG9uLmlubmVySFRNTCA9IFwiU3VibWl0XCI7XG4gICAgICAgIHN1Ym1pdEJ1dHRvbi5zZXRBdHRyaWJ1dGUoXCJ0eXBlXCIsIFwic3VibWl0XCIpO1xuICAgICAgICBzdWJtaXRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHRoaXMuc2lnbnVwQnV0dG9uQ2xpY2tlZC5iaW5kKHRoaXMsIHVzZXJuYW1lSW5wdXQsIGVtYWlsSW5wdXQsIHBhc3N3b3JkMUlucHV0LCBwYXNzd29yZDJJbnB1dCkpXG4gICAgXG5cbiAgICAgICAgY29uc3QgbG9naW5MaW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIilcbiAgICAgICAgbG9naW5MaW5rLmNsYXNzTGlzdC5hZGQoXCJsaW5rXCIpO1xuICAgICAgICBsb2dpbkxpbmsuaW5uZXJIVE1MID0gXCJTaWduIGluXCJcbiAgICAgICAgbG9naW5MaW5rLnNldEF0dHJpYnV0ZShcImhyZWZcIiwgXCIjL2xvZ2luXCIpO1xuXG4gICAgICAgIHJlZ2lzdGVyRm9ybS5hcHBlbmQodXNlcm5hbWVSZWdpc3RlckZvcm1Db250cm9sLCBlbWFpbFJlZ2lzdGVyRm9ybUNvbnRyb2wsIHBhc3N3b3JkMVJlZ2lzdGVyRm9ybUNvbnRyb2wsIHBhc3N3b3JkMlJlZ2lzdGVyRm9ybUNvbnRyb2wsIHN1Ym1pdEJ1dHRvbiwgIGxvZ2luTGluayk7XG5cbiAgICAgICAgY29udGFpbmVyLmFwcGVuZChyZWdpc3RlckZvcm0pO1xuICAgICAgICByZXR1cm4gY29udGFpbmVyO1xuICAgIH1cblxuICAgIHByaXZhdGUgc2hvd0Vycm9yTGFiZWwoaW5wdXQ6IEhUTUxJbnB1dEVsZW1lbnQsIGVycm9yTWVzc2FnZTogc3RyaW5nKSB7XG4gICAgICAgIGNvbnN0IGZvcm1Db250cm9sID0gPEhUTUxJbnB1dEVsZW1lbnQ+aW5wdXQucGFyZW50RWxlbWVudDtcbiAgICAgICAgZm9ybUNvbnRyb2wuY2xhc3NOYW1lID0gXCJmb3JtLWNvbnRyb2wgZXJyb3JcIjtcbiAgICAgICAgY29uc3Qgc21hbGwgPSBmb3JtQ29udHJvbC5xdWVyeVNlbGVjdG9yKFwic21hbGxcIik7XG4gICAgICAgIHNtYWxsIS5pbm5lclRleHQgPSBlcnJvck1lc3NhZ2U7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjaGVja0VtYWlsKGlucHV0OiBIVE1MSW5wdXRFbGVtZW50KTogQm9vbGVhbiB7XG4gICAgICAgIGNvbnN0IHJlID0gL14oKFtePD4oKVxcW1xcXVxcXFwuLDs6XFxzQFwiXSsoXFwuW148PigpXFxbXFxdXFxcXC4sOzpcXHNAXCJdKykqKXwoXCIuK1wiKSlAKChcXFtbMC05XXsxLDN9XFwuWzAtOV17MSwzfVxcLlswLTldezEsM31cXC5bMC05XXsxLDN9XFxdKXwoKFthLXpBLVpcXC0wLTldK1xcLikrW2EtekEtWl17Mix9KSkkLztcbiAgICAgICAgaWYgKCFyZS50ZXN0KGlucHV0LnZhbHVlLnRyaW0oKSkpIHtcbiAgICAgICAgICAgIHRoaXMuc2hvd0Vycm9yTGFiZWwoaW5wdXQsICdFbWFpbCBpcyBub3QgdmFsaWQnKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfSBcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjaGVja1Bhc3N3b3Jkc01hdGNoKGlucHV0MTogSFRNTElucHV0RWxlbWVudCwgaW5wdXQyOiBIVE1MSW5wdXRFbGVtZW50KTogQm9vbGVhbiB7XG4gICAgICAgIGlmIChpbnB1dDEudmFsdWUgIT09IGlucHV0Mi52YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5zaG93RXJyb3JMYWJlbChpbnB1dDIsICdQYXNzd29yZHMgZG8gbm90IG1hdGNoJyk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBcblxuICAgIHByaXZhdGUgY2hlY2tSZXF1aXJlZChpbnB1dEFycmF5OiBBcnJheTxIVE1MSW5wdXRFbGVtZW50Pik6IEJvb2xlYW57XG4gICAgICAgIGxldCBpc1JlcXVpcmVkID0gZmFsc2U7XG4gICAgICAgIGlucHV0QXJyYXkuZm9yRWFjaCgoaW5wdXQpID0+IHtcbiAgICAgICAgICAgIGlmKGlucHV0LnZhbHVlLnRyaW0oKSA9PT0gJycpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNob3dFcnJvckxhYmVsKGlucHV0LCAnSXQgaXMgcmVxdWlyZWQnKVxuICAgICAgICAgICAgICAgIGlzUmVxdWlyZWQgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGlzUmVxdWlyZWQ7XG4gICAgfVxufSIsImltcG9ydCB7IEZsYXNoY2FyZCB9IGZyb20gXCIuLi9tb2RlbHMvRGF0YU1vZGVsc1wiO1xuXG5jb25zdCBiYXNlVXJsPSAgXCJodHRwOi8vbG9jYWxob3N0OjgwODAvXCI7XG5jb25zdCBmbGFzaGNhcmRzVXJsID0gYmFzZVVybCArIFwiZmxhc2hjYXJkc1wiO1xuXG5leHBvcnQgY2xhc3MgRmxhc2hjYXJkc1NlcnZpY2UgIHtcbiAgICBwdWJsaWMgYXN5bmMgZ2V0Rmxhc2hjYXJkcyhhdXRob3JpemF0aW9uOnN0cmluZywgbmFtZVF1ZXJ5OiBzdHJpbmcpIHtcblxuICAgICAgICBjb25zdCB1cmwgPSBmbGFzaGNhcmRzVXJsICsgJz91c2VybmFtZT0nICsgbmFtZVF1ZXJ5O1xuICAgICAgICBjb25zdCBvcHRpb25zID0ge1xuICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICBBdXRob3JpemF0aW9uOiBhdXRob3JpemF0aW9uXG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBmZXRjaCh1cmwsIG9wdGlvbnMpO1xuICAgICAgICBjb25zdCByZXN1bHRKc29uID0gYXdhaXQgcmVzdWx0Lmpzb24oKTtcblxuICAgICAgICBpZihyZXN1bHQuc3RhdHVzICE9PSA0MDEpIHtcbiAgICAgICAgICAgIHJldHVybiByZXN1bHRKc29uO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSBcIiMvbG9naW5cIjtcbiAgICAgICAgICAgXG4gICAgICAgIH1cbiAgICAgIFxuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBhZGRGbGFzaGNhcmQoYXV0aG9yaXphdGlvbjpzdHJpbmcsIHF1ZXN0aW9uOnN0cmluZywgYW5zd2VyOnN0cmluZywgdXNlcm5hbWU6c3RyaW5nKSB7XG4gICAgICAgIGNvbnN0IHVybCAgPSBmbGFzaGNhcmRzVXJsXG4gICAgICAgIGNvbnN0IG9wdGlvbnMgPSB7XG4gICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICBhdXRob3JpemF0aW9uOiBhdXRob3JpemF0aW9uLFxuICAgICAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbidcbiAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgICAgICBxdWVzdGlvbjogcXVlc3Rpb24sXG4gICAgICAgICAgICAgICAgYW5zd2VyOiBhbnN3ZXIsXG4gICAgICAgICAgICAgICAgY3JlYXRlRGF0ZTogbmV3IERhdGUoKS5nZXRUaW1lKCksXG4gICAgICAgICAgICAgICAgdXNlcm5hbWUgOiB1c2VybmFtZSxcbiAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgZmV0Y2godXJsLCBvcHRpb25zKTtcblxuICAgICAgICBpZiAocmVzdWx0LnN0YXR1cyA9PSAyMDEpIHtcbiAgICAgICAgICAgIHJldHVybiBhd2FpdCByZXN1bHQuanNvbigpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICB9XG4gICAgXG59XG5cblxuIiwiaW1wb3J0IHsgU2Vzc2lvblRva2VuIH0gZnJvbSBcIi4uL21vZGVscy9BdXRoZW50aWNhdGlvbk1vZGVsc1wiO1xuY29uc3QgYmFzZVVybCA9ICdodHRwOi8vbG9jYWxob3N0OjgwODAvJztcbmNvbnN0IGxvZ2luVXJsID0gYmFzZVVybCArICdsb2dpbic7XG5cbmV4cG9ydCBjbGFzcyBMb2dpblNlcnZpY2Uge1xuXG4gICAgcHVibGljIGFzeW5jIGxvZ2luKHVzZXJOYW1lOiBzdHJpbmcsIHBhc3N3b3JkOiBzdHJpbmcpOiBQcm9taXNlPFNlc3Npb25Ub2tlbiB8IHVuZGVmaW5lZD4ge1xuICAgICAgICBjb25zdCBvcHRpb25zID0ge1xuICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgICAgICB1c2VybmFtZTogdXNlck5hbWUsXG4gICAgICAgICAgICAgICAgcGFzc3dvcmQ6IHBhc3N3b3JkXG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgZmV0Y2gobG9naW5VcmwsIG9wdGlvbnMpO1xuICAgICAgICBpZiAocmVzdWx0LnN0YXR1cyA9PSAyMDEpIHtcbiAgICAgICAgICAgIHJldHVybiBhd2FpdCByZXN1bHQuanNvbigpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsImltcG9ydCB7IFNlc3Npb25Ub2tlbiB9IGZyb20gXCIuLi9tb2RlbHMvQXV0aGVudGljYXRpb25Nb2RlbHNcIjtcbmNvbnN0IGJhc2VVcmwgPSAnaHR0cDovL2xvY2FsaG9zdDo4MDgwLyc7XG5jb25zdCBzaWdudXBVcmwgID0gYmFzZVVybCArICAnc2lnbnVwJztcblxuZXhwb3J0IGNsYXNzIFNpZ25VcFNlcnZpY2Uge1xuICAgIHB1YmxpYyBhc3luYyBzaWdudXAodXNlck5hbWU6IHN0cmluZywgcGFzc3dvcmQ6IHN0cmluZyk6IFByb21pc2U8U2Vzc2lvblRva2VuIHwgdW5kZWZpbmVkPiB7XG4gICAgICAgIGNvbnN0IG9wdGlvbnMgPSB7XG4gICAgICAgICAgICBtZXRob2Q6IFwiUFVUXCIsXG4gICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgICAgICB1c2VybmFtZTogdXNlck5hbWUsXG4gICAgICAgICAgICAgICAgcGFzc3dvcmQ6IHBhc3N3b3JkLFxuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IGZldGNoKHNpZ251cFVybCwgb3B0aW9ucyk7XG4gICAgIFxuICAgICAgICBpZiAocmVzdWx0LnN0YXR1cyA9PSAyMDEpIHtcbiAgICAgICAgICAgIHJldHVybiBhd2FpdCByZXN1bHQuanNvbigpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgIH1cbn0iLCJpbXBvcnQgeyBGbGFzaGNhcmQgfSBmcm9tIFwiLi4vbW9kZWxzL0RhdGFNb2RlbHNcIjtcbmltcG9ydCB7IEZsYXNoY2FyZHNDb250cm9sbGVyIH0gZnJvbSBcIi4uL2NvbnRyb2xsZXJzL0ZsYXNoY2FyZENvbnRyb2xsZXJcIjtcblxuZXhwb3J0IGNsYXNzIEZsYXNoY2FyZHNWaWV3ICB7XG4gICAgcHJpdmF0ZSBfY3VycmVudEFjdGl2ZUNhcmQ6bnVtYmVyID0gMDtcbiAgICBwcml2YXRlIF9jYXJkc0VsOmFueSA9IFtdO1xuXG4gICAgcHVibGljIGNyZWF0ZURPTSgpIHtcbiAgICAgICAgY29uc3Qgc2lnbm91dEJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpO1xuICAgICAgICBzaWdub3V0QnV0dG9uLmNsYXNzTmFtZSA9IFwiYnRuIGJ0bi1zbWFsbFwiO1xuICAgICAgICBzaWdub3V0QnV0dG9uLmlubmVyVGV4dCA9IFwiU2lnbiBvdXRcIjtcbiAgICAgICAgc2lnbm91dEJ1dHRvbi5pZCA9IFwic2lnbi1vdXRcIjtcbiAgICAgICAgc2lnbm91dEJ1dHRvbi5zZXRBdHRyaWJ1dGUoXCJocmVmXCIsIFwiIy9sb2dpblwiKTtcbiAgICAgICAgc2lnbm91dEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCk9PiB7XG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2UuY2xlYXIoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgY29uc3QgYmlnVGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaDJcIik7XG4gICAgICAgIGJpZ1RpdGxlLmlubmVySFRNTCA9IFwiRmxhc2hjYXJkcyBjb250cm9sbGVyXCJcbiAgICAgICAgY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgY29udGFpbmVyLmNsYXNzTmFtZSA9IFwiZmxhc2hjYXJkLWxpc3RpbmctY29tcG9uZW50XCI7XG4gICAgICAgIGNvbnN0IHRpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImgxXCIpO1xuICAgICAgICB0aXRsZS5pbm5lclRleHQgPSBcIkZsYXNoY2FyZHNcIjtcbiAgICAgICAgY29uc3QgYWRkQnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcbiAgICAgICAgYWRkQnV0dG9uLmNsYXNzTmFtZSA9IFwiYnRuIGJ0bi1zbWFsbFwiO1xuICAgICAgICBhZGRCdXR0b24uaWQgPSBcInNob3dcIjtcbiAgICAgICAgYWRkQnV0dG9uLmlubmVyVGV4dCA9IFwiQWRkIE5ldyBDYXJkXCI7XG4gICAgICAgIGFkZEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4gYWRkQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJzaG93XCIpKVxuICAgICAgICB0aXRsZS5hcHBlbmRDaGlsZChhZGRCdXR0b24pO1xuICAgICAgICBjb25zdCBjYXJkc0NvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG5cdCAgICBjYXJkc0NvbnRhaW5lci5jbGFzc05hbWUgPSBcImNhcmRzXCI7XG5cdCAgICBjYXJkc0NvbnRhaW5lci5pZCA9IFwiY2FyZHMtY29udGFpbmVyXCI7XG4gICAgICAgIGNvbnN0IG5hdmlnYXRpb24gPSAgZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgbmF2aWdhdGlvbi5jbGFzc05hbWUgPSBcIm5hdmlnYXRpb25cIjtcbiAgICAgICAgY29uc3QgcHJldkJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XG4gICAgICAgIHByZXZCdXR0b24uY2xhc3NOYW1lID0gXCJuYXYtYnV0dG9uXCI7XG4gICAgICAgIHByZXZCdXR0b24uaWQgPSBcInByZXZcIjtcbiAgICAgICAgY29uc3QgbGVmdEFycm93ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlcIik7XG4gICAgICAgIGxlZnRBcnJvdy5jbGFzc05hbWUgPSBcImZhcyBmYS1hcnJvdy1sZWZ0XCI7XG4gICAgICAgIHByZXZCdXR0b24uYXBwZW5kQ2hpbGQobGVmdEFycm93KTtcbiAgICAgICAgcHJldkJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgdGhpcy5wcmV2QnV0dG9uQ2xpY2tlZC5iaW5kKHRoaXMpKTtcbiAgICAgICAgbmF2aWdhdGlvbi5hcHBlbmRDaGlsZChwcmV2QnV0dG9uKTtcbiAgICAgICAgY29uc3QgY3VycmVudFBhcmEgPSAgZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICAgICAgICBjdXJyZW50UGFyYS5pZCA9ICdjdXJyZW50JztcbiAgICAgICAgbmF2aWdhdGlvbi5hcHBlbmRDaGlsZChjdXJyZW50UGFyYSlcbiAgICAgICAgY29uc3QgbmV4dEJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgICAgICBuZXh0QnV0dG9uLmNsYXNzTmFtZSA9ICduYXYtYnV0dG9uJztcbiAgICAgICAgbmV4dEJ1dHRvbi5pZCA9ICduZXh0JztcbiAgICAgICAgY29uc3QgcmlnaHRBcnJvdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2knKTtcbiAgICAgICAgcmlnaHRBcnJvdy5jbGFzc05hbWUgPSAnZmFzIGZhLWFycm93LXJpZ2h0JztcbiAgICAgICAgbmV4dEJ1dHRvbi5hcHBlbmRDaGlsZChyaWdodEFycm93KTtcbiAgICAgICAgbmF2aWdhdGlvbi5hcHBlbmRDaGlsZChuZXh0QnV0dG9uKTtcbiAgICAgICAgbmV4dEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMubmV4dEJ1dHRvbkNsaWNrZWQuYmluZCh0aGlzKSk7XG4gICAgICAgIGNvbnN0IGFkZENvbnRhaW5lciAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgYWRkQ29udGFpbmVyLmNsYXNzTmFtZSA9ICdhZGQtY29udGFpbmVyJztcbiAgICAgICAgYWRkQ29udGFpbmVyLmlkID0gJ2FkZC1jb250YWluZXInO1xuICAgICAgICBjb25zdCBoMSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2gxJyk7XG4gICAgICAgIGgxLmlubmVySFRNTCA9ICdBZGQgTmV3IENhcmQnO1xuICAgICAgICBhZGRDb250YWluZXIuYXBwZW5kQ2hpbGQoaDEpO1xuICAgICAgICBjb25zdCBnaG9zdEJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgICAgICBnaG9zdEJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ2lkJywgJ2hpZGUnKVxuICAgICAgICBnaG9zdEJ1dHRvbi5jbGFzc05hbWUgPSAnYnRuIGJ0bi1zbWFsbCBidG4tZ2hvc3QnO1xuICAgICAgICBjb25zdCB0aW1lc0ljb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpJyk7XG4gICAgICAgIHRpbWVzSWNvbi5jbGFzc05hbWUgPSAnZmFzIGZhLXRpbWVzJztcbiAgICAgICAgZ2hvc3RCdXR0b24uYXBwZW5kQ2hpbGQodGltZXNJY29uKTtcbiAgICAgICAgaDEuYXBwZW5kQ2hpbGQoZ2hvc3RCdXR0b24pO1xuICAgICAgICBnaG9zdEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IGFkZENvbnRhaW5lci5jbGFzc0xpc3QucmVtb3ZlKCdzaG93JykpXG4gICAgICAgIGNvbnN0IGZvcm1Hcm91cDEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgY29uc3QgcXVlc3Rpb25MYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xhYmVsJyk7XG4gICAgICAgIGZvcm1Hcm91cDEuY2xhc3NOYW1lID0gJ2Zvcm0tZ3JvdXAnO1xuICAgICAgICBxdWVzdGlvbkxhYmVsLnNldEF0dHJpYnV0ZSgnZm9yJywgJ3F1ZXN0aW9uJyk7XG4gICAgICAgIGZvcm1Hcm91cDEuYXBwZW5kQ2hpbGQocXVlc3Rpb25MYWJlbCk7XG4gICAgICAgIGNvbnN0IHF1ZXN0aW9uVGV4dEFyZWEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZXh0YXJlYScpO1xuICAgICAgICBxdWVzdGlvblRleHRBcmVhLnNldEF0dHJpYnV0ZSgncGxhY2Vob2xkZXInLCAnRW50ZXIgcXVlc3Rpb24nKTtcbiAgICAgICAgcXVlc3Rpb25UZXh0QXJlYS5pZCA9ICdxdWVzdGlvbic7IFxuICAgICAgICBmb3JtR3JvdXAxLmFwcGVuZENoaWxkKHF1ZXN0aW9uVGV4dEFyZWEpO1xuICAgICAgICBhZGRDb250YWluZXIuYXBwZW5kQ2hpbGQoZm9ybUdyb3VwMSApXG4gICAgICAgIGNvbnN0IGZvcm1Hcm91cDIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgZm9ybUdyb3VwMi5jbGFzc05hbWUgPSAnZm9ybS1ncm91cCc7XG4gICAgICAgIGNvbnN0IGFuc3dlckxhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGFiZWwnKTtcbiAgICAgICAgYW5zd2VyTGFiZWwuc2V0QXR0cmlidXRlKCdmb3InLCAnYW5zd2VyJyk7XG4gICAgICAgIGZvcm1Hcm91cDIuYXBwZW5kQ2hpbGQoYW5zd2VyTGFiZWwpXG4gICAgICAgIGNvbnN0IGFuc3dlclRleHRBcmVhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGV4dGFyZWEnKTtcbiAgICAgICAgYW5zd2VyVGV4dEFyZWEuc2V0QXR0cmlidXRlKCdwbGFjZWhvbGRlcicsICdFbnRlciBhbnN3ZXInKTtcbiAgICAgICAgYW5zd2VyVGV4dEFyZWEuaWQgPSAnYW5zd2VyJztcbiAgICAgICAgZm9ybUdyb3VwMi5hcHBlbmRDaGlsZChhbnN3ZXJUZXh0QXJlYSk7XG4gICAgICAgIGFkZENvbnRhaW5lci5hcHBlbmRDaGlsZChmb3JtR3JvdXAyKVxuICAgICAgICBjb25zdCBhZGRDYXJkQnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgICAgIGFkZENhcmRCdXR0b24uaWQgPSAnYWRkLWNhcmQnO1xuICAgICAgICBhZGRDYXJkQnV0dG9uLmNsYXNzTmFtZSA9ICdidG4nXG4gICAgICAgIGNvbnN0IHBsdXNJY29uID0gIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2knKVxuICAgICAgICBwbHVzSWNvbi5jbGFzc05hbWUgPSAnZmFzIGZhLXBsdXMnO1xuICAgICAgICBhZGRDYXJkQnV0dG9uLmlubmVyVGV4dCA9ICdBZGQgQ2FyZCc7XG4gICAgICAgIGFkZENhcmRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLmFkZENhcmRCdXR0b25DbGlja2VkLmJpbmQodGhpcykpXG4gICAgICAgIGFkZENhcmRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiBhZGRDb250YWluZXIuY2xhc3NMaXN0LnJlbW92ZSgnc2hvdycpKVxuICAgICAgICBhZGRDb250YWluZXIuYXBwZW5kQ2hpbGQoYWRkQ2FyZEJ1dHRvbik7XG5cbiAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKHNpZ25vdXRCdXR0b24pO1xuICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQodGl0bGUpO1xuICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoY2FyZHNDb250YWluZXIpO1xuICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQobmF2aWdhdGlvbik7XG4gICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChhZGRDb250YWluZXIpO1xuICAgIFxuICAgICAgICByZXR1cm4gIGNvbnRhaW5lcjtcbiAgICAgICAgICAgIFxuICAgIH1cblxuICAgIHB1YmxpYyBsaXN0aW5nQWRkKGZsYXNoY2FyZDogRmxhc2hjYXJkLCBpbmRleDogbnVtYmVyKSB7XG4gICAgICAgIGNvbnN0IGNhcmQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICBjYXJkLmNsYXNzTGlzdC5hZGQoXCJjYXJkXCIpO1xuICAgICAgICBpZiAoaW5kZXggPT09IDApIGNhcmQuY2xhc3NOYW1lID0gJ2FjdGl2ZSBjYXJkJztcbiAgICAgICAgXG4gICAgICAgIGNvbnN0IGlubmVyQ2FyZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBpbm5lckNhcmQuY2xhc3NOYW1lID0gJ2lubmVyLWNhcmQnO1xuICAgICAgICBjYXJkLmFwcGVuZENoaWxkKGlubmVyQ2FyZClcbiAgICAgICAgY29uc3QgaW5uZXJDYXJkRnJvbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgaW5uZXJDYXJkRnJvbnQuY2xhc3NOYW1lID0gJ2lubmVyLWNhcmQtZnJvbnQnO1xuICAgICAgICBpbm5lckNhcmQuYXBwZW5kQ2hpbGQoaW5uZXJDYXJkRnJvbnQpXG4gICAgICAgIGNvbnN0IHF1ZXN0aW9uUGFyYSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbiAgICAgICAgcXVlc3Rpb25QYXJhLmlubmVyVGV4dCA9IGZsYXNoY2FyZC5xdWVzdGlvbjtcbiAgICAgICAgaW5uZXJDYXJkRnJvbnQuYXBwZW5kQ2hpbGQocXVlc3Rpb25QYXJhKTtcbiAgICAgICAgY29uc3QgaW5uZXJDYXJkQmFjayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBpbm5lckNhcmRCYWNrLmNsYXNzTmFtZSA9ICdpbm5lci1jYXJkLWJhY2snO1xuICAgICAgICBpbm5lckNhcmQuYXBwZW5kKGlubmVyQ2FyZEJhY2spXG4gICAgICAgIGNvbnN0IGFuc3dlclBhcmEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG4gICAgICAgIGFuc3dlclBhcmEuaW5uZXJUZXh0ID0gZmxhc2hjYXJkLmFuc3dlcjtcbiAgICAgICAgaW5uZXJDYXJkQmFjay5hcHBlbmRDaGlsZChhbnN3ZXJQYXJhKTtcbiAgICAgICAgY29uc3QgY2FyZHNDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2FyZHMtY29udGFpbmVyJyk7XG4gICAgICAgIGNhcmRzQ29udGFpbmVyIS5hcHBlbmRDaGlsZChjYXJkKTtcbiAgICAgICAgY2FyZC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IGNhcmQuY2xhc3NMaXN0LnRvZ2dsZSgnc2hvdy1hbnN3ZXInKSlcbiAgICAgICAgdGhpcy5fY2FyZHNFbC5wdXNoKGNhcmQpO1xuICAgICAgICB0aGlzLnVwZGF0ZUN1cnJlbnRUZXh0LmNhbGwodGhpcyk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSB1cGRhdGVDdXJyZW50VGV4dCgpe1xuICAgICAgICBjb25zdCBjdXJyZW50RWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY3VycmVudCcpO1xuICAgICAgICBjdXJyZW50RWwhLmlubmVyVGV4dCA9IGAke3RoaXMuX2N1cnJlbnRBY3RpdmVDYXJkICsgMX0vJHt0aGlzLl9jYXJkc0VsLmxlbmd0aH1gO1xuICAgIH1cblxuICAgIHByaXZhdGUgbmV4dEJ1dHRvbkNsaWNrZWQgKCl7XG5cbiAgICAgICAgdGhpcy5fY2FyZHNFbFt0aGlzLl9jdXJyZW50QWN0aXZlQ2FyZF0uY2xhc3NOYW1lID0gJ2NhcmQgbGVmdCc7XG4gICAgICAgIHRoaXMuX2N1cnJlbnRBY3RpdmVDYXJkID0gdGhpcy5fY3VycmVudEFjdGl2ZUNhcmQgKyAxO1xuICAgICAgICBpZiAodGhpcy5fY3VycmVudEFjdGl2ZUNhcmQgPiB0aGlzLl9jYXJkc0VsLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgIHRoaXMuX2N1cnJlbnRBY3RpdmVDYXJkID0gdGhpcy5fY2FyZHNFbC5sZW5ndGggLSAxO1xuICAgICAgICB9XG4gICAgXG4gICAgICAgIHRoaXMuX2NhcmRzRWxbdGhpcy5fY3VycmVudEFjdGl2ZUNhcmRdLmNsYXNzTmFtZSA9ICdjYXJkIGFjdGl2ZSc7XG4gICAgICAgIHRoaXMudXBkYXRlQ3VycmVudFRleHQuY2FsbCh0aGlzKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHByZXZCdXR0b25DbGlja2VkICgpe1xuICAgICAgICB0aGlzLl9jYXJkc0VsW3RoaXMuX2N1cnJlbnRBY3RpdmVDYXJkXS5jbGFzc05hbWUgPSAnY2FyZCByaWdodCc7XG4gICAgICAgIHRoaXMuX2N1cnJlbnRBY3RpdmVDYXJkID0gdGhpcy5fY3VycmVudEFjdGl2ZUNhcmQgLSAxO1xuICAgIFxuICAgICAgICBpZiAodGhpcy5fY3VycmVudEFjdGl2ZUNhcmQgPCAwKSB7XG4gICAgICAgICAgICB0aGlzLl9jdXJyZW50QWN0aXZlQ2FyZCA9IDA7XG4gICAgICAgIH1cbiAgICBcbiAgICAgICAgdGhpcy5fY2FyZHNFbFt0aGlzLl9jdXJyZW50QWN0aXZlQ2FyZF0uY2xhc3NOYW1lID0gJ2NhcmQgYWN0aXZlJztcbiAgICAgICAgdGhpcy51cGRhdGVDdXJyZW50VGV4dC5jYWxsKHRoaXMpO1xuXG4gICAgfVxuXG4gICAgcHVibGljIGFkZENhcmRCdXR0b25DbGlja2VkKCkge1xuICAgICAgICBjb25zdCBmbGFzaGNhcmRzQ29udHJvbGxlciA9IG5ldyBGbGFzaGNhcmRzQ29udHJvbGxlcigpO1xuICAgICAgICBjb25zdCBxdWVzdGlvbiA9IChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncXVlc3Rpb24nKSBhcyBIVE1MVGV4dEFyZWFFbGVtZW50KS52YWx1ZTtcbiAgICAgICAgY29uc3QgYW5zd2VyICAgPSAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Fuc3dlcicpIGFzIEhUTUxUZXh0QXJlYUVsZW1lbnQpLnZhbHVlO1xuICAgICAgICBmbGFzaGNhcmRzQ29udHJvbGxlci5hZGREYXRhKHF1ZXN0aW9uLCBhbnN3ZXIpXG4gICAgfVxuXG4gICAgcHVibGljIGxpc3RpbmdDbGVhcigpIHtcbiAgICAgICAgY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NhcmRzLWNvbnRhaW5lcicpXG4gICAgICAgIGlmKCFjb250YWluZXIpIHtyZXR1cm47IH1cbiAgICAgICAgd2hpbGUoIGNvbnRhaW5lci5jaGlsZHJlbi5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBjb250YWluZXIucmVtb3ZlQ2hpbGQoY29udGFpbmVyLmNoaWxkcmVuWzBdKVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2NhcmRzRWwgPSBbXTtcbiAgICAgICAgdGhpcy5fY3VycmVudEFjdGl2ZUNhcmQgPSAwXG5cbiAgICAgICAgY29uc3QgbmV4dEJ1dHRvbiA9IDxIVE1MRWxlbWVudD5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5leHRcIik7XG4gICAgICAgIG5leHRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLm5leHRCdXR0b25DbGlja2VkLmJpbmQodGhpcykpO1xuXG4gICAgICAgIGNvbnN0IHByZXZCdXR0b24gPSA8SFRNTEVsZW1lbnQ+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwcmV2XCIpO1xuICAgICAgICBwcmV2QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5wcmV2QnV0dG9uQ2xpY2tlZC5iaW5kKHRoaXMpKTtcbiAgICB9IFxufVxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgeyBIYXNoUm91dGVyfSBmcm9tIFwiLi9Sb3V0ZXJcIjtcblxuZXhwb3J0IGNsYXNzIE1haW4ge1xuICAgIHByaXZhdGUgcm91dGVyOiBIYXNoUm91dGVyID0gbmV3IEhhc2hSb3V0ZXIoKTtcbiAgXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBjb25zb2xlLmxvZyhgQ29uc3RydWN0b3JlZCBuZXcgSW5zdGFuY2Ugb2YgdGhlIHByb2dyYW1gKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgbGF1bmNoQXBwKCkge1xuXHRcdGNvbnN0IGxvY2FsVG9rZW4gPSAgSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnY3VycmVudFVzZXInKSEpO1xuXG4gICAgICAgIGxldCBjb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1haW4tY29udGFpbmVyXCIpIGFzIEhUTUxFbGVtZW50O1xuICAgICAgICB0aGlzLnJvdXRlci5yZWdpc3RlckluZGV4KCgpID0+ICh0aGlzLnJvdXRlci5ob21lcGFnZVZpZXcoKSkpO1xuICAgICAgICB0aGlzLnJvdXRlci5yZWdpc3RlcihcIi9sb2dpblwiLCAoKSA9PiAoIHRoaXMucm91dGVyLnN3aXRjaFRvTG9naW5WaWV3KCkpKTtcbiAgICAgICAgXG5cbiAgICAgICAgaWYobG9jYWxUb2tlbiAhPT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy5yb3V0ZXIucmVnaXN0ZXIoXCIvZmxhc2hjYXJkc1wiLCAoKSA9PiAodGhpcy5yb3V0ZXIuc3dpdGNoVG9GbGFzaGNhcmRzVmlldyhsb2NhbFRva2VuLnRva2VuKSkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICBcbiAgICAgICAgICAgIHRoaXMucm91dGVyLnJlZ2lzdGVyKFwiL2ZsYXNoY2FyZHNcIiwgKCkgPT4gKCB0aGlzLnJvdXRlci5zd2l0Y2hUb0xvZ2luVmlldygpKSk7XG5cbiAgICAgICAgfVxuICAgIFxuXHRcdC8vIHRoaXMucm91dGVyLnJlZ2lzdGVyKFwiL3BhZ2UzXCIsICgpID0+IChjb250YWluZXIuaW5uZXJIVE1MID0gXCJwYWdlM1wiKSk7XG5cdFx0Ly8gdGhpcy5yb3V0ZXIucmVnaXN0ZXIoXCIvcGFnZTRcIiwgKCkgPT4ge1xuXHRcdC8vICAgdGhyb3cgbmV3IEVycm9yKFwiZXJyb3JcIik7XG5cdFx0Ly8gfSk7XG5cbiAgICAgICAgdGhpcy5yb3V0ZXIubG9hZCgpO1xuXG4gICAgICAgIHRoaXMucm91dGVyLnJlZ2lzdGVyTm90Rm91bmQoKCkgPT4gKGNvbnRhaW5lci5pbm5lckhUTUwgPSBcIm5vdCBmb3VuZFwiKSk7XG5cblx0XHQvLyB0aGlzLnJvdXRlci5yZWdpc3RlckVycm9yKFxuXHRcdC8vICAgKGUpID0+IChjb250YWluZXIuaW5uZXJIVE1MID0gXCJFcnJvciBtZXNzYWdl77yaPGJyPlwiICsgZS5tZXNzYWdlKVxuXHRcdC8vICk7XG4gIH1cbn1cblxubmV3IE1haW4oKS5sYXVuY2hBcHAoKTsiXSwic291cmNlUm9vdCI6IiJ9