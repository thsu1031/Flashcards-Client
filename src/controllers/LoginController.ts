import { LoginService } from "../services/LoginService";
import { HashRouter } from "../Router"

export class LoginController  {
    private loginService = new LoginService()
    private router = new HashRouter();

    private async loginButtonClicked(username: any, password: any,  event: any){
        event.preventDefault();
        if (username.value &&  password.value) {
            const result =  await this.loginService.login(username.value, password.value)
            // console.log(result)
            if(result) {
                this.router.switchToFlashcardsView(result)
                window.history.pushState("object or string", "Flashcards", "#/flashcards");
                
            } else {
                // TODO showErrorLabel
            }
        } else {
            // TODO showErrorLabel
        }
    }

    public createView(): HTMLDivElement {
        const container = document.createElement("div");
        container.classList.add("container");

        const loginForm = document.createElement("form");
        loginForm.classList.add("form");
        loginForm.setAttribute("id", "form");

        const usernameLoginFormControl =  document.createElement("div");
        usernameLoginFormControl.classList.add("form-control");
        const usernameLabel =  document.createElement("label");
        usernameLabel.setAttribute("for", "username");
        usernameLabel.innerText = "Username";
        const usernameInput = document.createElement("input");
        usernameInput.setAttribute("type", "text");
        usernameInput.setAttribute("id", "username");
        const usernameErrorMessage = document.createElement("small");
        usernameErrorMessage.innerHTML = "Error message";
        usernameLoginFormControl.append( usernameLabel, usernameInput, usernameErrorMessage);

        const passwordFormControl =  document.createElement("div");
        passwordFormControl.classList.add("form-control");
        const passwordLabel =  document.createElement("label");
        passwordLabel.setAttribute("for", "password");
        passwordLabel.innerText = "Password";
        const passwordInput = document.createElement("input");
        passwordInput.setAttribute("type", "password");
        passwordInput.setAttribute("id", "password");
        const passwordErrorMessage = document.createElement("small");
        passwordErrorMessage.innerHTML = "Error message";
        passwordFormControl.append( passwordLabel, passwordInput, passwordErrorMessage);

        loginForm.append(usernameLoginFormControl, passwordFormControl)

        const loginButton =  document.createElement("button");
        loginButton.innerHTML = "Log in";
        loginButton.setAttribute("type", "submit");
        loginButton.addEventListener('click',this.loginButtonClicked.bind(this, usernameInput,passwordInput))

        const signupLink =  document.createElement('a');
        signupLink.innerHTML = "Sign up"

        signupLink.classList.add("link");
        signupLink.setAttribute("href", "");



        loginForm.append(usernameLoginFormControl, passwordFormControl, loginButton, signupLink)

        container.append(loginForm);

        return container;
    }
}
