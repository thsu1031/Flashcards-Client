import { SignUpService } from "../services/SignUpService";
import { HashRouter } from "../Router"
import { BaseController } from "./BaseController";

export class MainController extends BaseController {

    private signupService = new SignUpService();
    private router = new HashRouter();

    private async signupButtonClicked(
        username : HTMLInputElement, 
        email    : HTMLInputElement,
        password1: HTMLInputElement, 
        password2: HTMLInputElement,
        event    : MouseEvent) {
        event.preventDefault();

        if(!this.checkRequired([username, email, password1, password2])){
            if(this.checkEmail(email)) {};
            if(this.checkPasswordsMatch(password1, password2)){};
        } 
    
        const result = await this.signupService.signup(username.value, password1.value);

        if (username.value && password1.value) {
            this.router.switchToFlashcardsView(result);
        }
    }

    public createView(): HTMLDivElement {
        const container = document.createElement("div");
        container.classList.add("container");
        const registerForm = document.createElement("form");
        registerForm.classList.add("form");
        registerForm.setAttribute("id", "form");

        const usernameRegisterFormControl =  document.createElement("div");
        usernameRegisterFormControl.classList.add("form-control");
        const usernameLabel =  document.createElement("label");
        usernameLabel.setAttribute("for", "username");
        usernameLabel.innerText = "Username";
        const usernameInput = document.createElement("input");
        usernameInput.setAttribute("type", "text");
        usernameInput.setAttribute("id", "username");
        const usernameErrorMessage = document.createElement("small");
        usernameErrorMessage.innerHTML = "Error message";
        usernameRegisterFormControl.append( usernameLabel, usernameInput, usernameErrorMessage);

        const emailRegisterFormControl =  document.createElement("div")
        emailRegisterFormControl.classList.add("form-control");
        const emailLabel =  document.createElement("label");
        emailLabel.setAttribute("for", "email");
        emailLabel.innerText = "Email";
        const emailInput = document.createElement("input");
        emailInput.setAttribute("type", "text");
        emailInput.setAttribute("id", "email");
        const emailErrorMessage = document.createElement("small");
        emailErrorMessage.innerHTML = "Error message";
        emailRegisterFormControl.append(emailLabel, emailInput, emailErrorMessage);

        const password1RegisterFormControl =  document.createElement("div")
        password1RegisterFormControl .classList.add("form-control");
        const password1Label =  document.createElement("label");
        password1Label.setAttribute("for", "password");
        password1Label.innerText = "Password";
        const password1Input = document.createElement("input");
        password1Input.setAttribute("type", "password");
        password1Input.setAttribute("id", "password1");
        const password1ErrorMessage = document.createElement("small");
        password1ErrorMessage.innerHTML = "Error message";
        password1RegisterFormControl.append(password1Label,  password1Input, password1ErrorMessage);

        const password2RegisterFormControl =  document.createElement("div")
        password2RegisterFormControl .classList.add("form-control");
        const password2Label =  document.createElement("label");
        password2Label.setAttribute("for", "password");
        password2Label.innerText = "Confirm Password";
        const password2Input = document.createElement("input");
        password2Input.setAttribute("type", "password");
        password2Input.setAttribute("id", "password2");
        const password2ErrorMessage = document.createElement("small");
        password2ErrorMessage.innerHTML = "Error message";
        password2RegisterFormControl.append(password2Label,  password2Input, password2ErrorMessage);

        const submitButton =  document.createElement("button");
        submitButton.innerHTML = "Submit";
        submitButton.setAttribute("type", "submit");
        submitButton.addEventListener("click", this.signupButtonClicked.bind(this, usernameInput, emailInput, password1Input, password2Input))
    

        const loginLink = document.createElement("a")
        loginLink.classList.add("link");
        loginLink.innerHTML = "Sign in"
        loginLink.setAttribute("href", "#/login");

        registerForm.append(usernameRegisterFormControl, emailRegisterFormControl, password1RegisterFormControl, password2RegisterFormControl, submitButton,  loginLink);

        container.append(registerForm);
        return container;
    }

    private showErrorLabel(input: HTMLInputElement, errorMessage: string) {
        const formControl = <HTMLInputElement>input.parentElement;
        formControl.className = "form-control error";
        const small = formControl.querySelector("small");
        small!.innerText = errorMessage;
    }

    private checkEmail(input: HTMLInputElement): Boolean {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!re.test(input.value.trim())) {
            this.showErrorLabel(input, 'Email is not valid');
            return false;
        } 
        return true;
    }

    private checkPasswordsMatch(input1: HTMLInputElement, input2: HTMLInputElement): Boolean {
        if (input1.value !== input2.value) {
            this.showErrorLabel(input2, 'Passwords do not match');
            return false;
        }
        return true;
    } 

    private checkRequired(inputArray: Array<HTMLInputElement>): Boolean{
        let isRequired = false;
        inputArray.forEach((input) => {
            if(input.value.trim() === '') {
                this.showErrorLabel(input, 'It is required')
                isRequired = true;
            }
        });
        return isRequired;
    }
}