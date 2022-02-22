import { MainController } from "./controllers/MainController";
import { LoginController } from "./controllers/LoginController";
import { SessionToken } from "./models/AuthenticationModels";
import { FlashcardsController } from "./controllers/FlashcardController";

export class HashRouter {
    private mainElement = document.getElementById('main-container');
    private routers: any;
    constructor(){
        this.routers = {};
        window.addEventListener('hashchange',this.load.bind(this), false)
    }
 
    register(hash: string, callback = function(){}){
        this.routers[hash] = callback;
    }
   
    registerIndex(callback = function(){}){
        this.routers['index'] = callback;
    }
   
    registerNotFound(callback = function(){}){
        this.routers['404'] = callback;
    }
 
    registerError(callback = function(){}){
        this.routers['error'] = callback;
    }
  
    load(){
        let hash = location.hash.slice(1);
        let handler;
      
        if(!hash){
            handler = this.routers.index;
        } else if(!this.routers.hasOwnProperty(hash)){
            handler = this.routers['404'] || function(){};
        }
        else {
            handler = this.routers[hash]
        }
      
        try {
            handler.apply(this);
        } catch(e){
            console.log(e);
        }
    }

    public switchToLoginView() {
        if (this.mainElement) {
            this.mainElement.innerHTML = "";
            const loginController: LoginController = new LoginController();
            this.mainElement.append(loginController.createView());
        }
    }

    public homepageView() {
        if(this.mainElement) {
            this.mainElement.innerHTML = "";
            const mainController: MainController = new MainController();
            this.mainElement.append(mainController.createView());
        }
    }

    public switchToFlashcardsView(sessionToken: SessionToken | undefined) {
        if (!sessionToken) return;
    
        if (this.mainElement) {
            this.mainElement.innerHTML = "";
            const flashcardsController = new FlashcardsController();
            if (sessionToken) {
                flashcardsController.setSessionToken(sessionToken);
            }

            this.mainElement.append(flashcardsController.createView());
        }
    }
}








