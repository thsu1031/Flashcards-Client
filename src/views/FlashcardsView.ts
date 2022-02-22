import { Flashcard } from "../models/DataModels";
import { FlashcardsController } from "../controllers/FlashcardController";

export class FlashcardsView  {
    private _currentActiveCard:number = 0;
    private _cardsEl:any = [];

    public createDOM() {
        const signoutButton = document.createElement("a");
        signoutButton.className = "btn btn-small";
        signoutButton.innerText = "Sign out";
        signoutButton.id = "sign-out";
        signoutButton.setAttribute("href", "#/login");
        signoutButton.addEventListener("click", ()=> {
            localStorage.clear();
        });

        const bigTitle = document.createElement("h2");
        bigTitle.innerHTML = "Flashcards controller"
        const container = document.createElement("div");
        container.className = "flashcard-listing-component";
        const title = document.createElement("h1");
        title.innerText = "Flashcards";
        const addButton = document.createElement("button");
        addButton.className = "btn btn-small";
        addButton.id = "show";
        addButton.innerText = "Add New Card";
        addButton.addEventListener("click", () => addContainer.classList.add("show"))
        title.appendChild(addButton);
        const cardsContainer = document.createElement("div");
	    cardsContainer.className = "cards";
	    cardsContainer.id = "cards-container";
        const navigation =  document.createElement("div");
        navigation.className = "navigation";
        const prevButton = document.createElement("button");
        prevButton.className = "nav-button";
        prevButton.id = "prev";
        const leftArrow = document.createElement("i");
        leftArrow.className = "fas fa-arrow-left";
        prevButton.appendChild(leftArrow);
        prevButton.addEventListener("click", this.prevButtonClicked.bind(this));
        navigation.appendChild(prevButton);
        const currentPara =  document.createElement('p');
        currentPara.id = 'current';
        navigation.appendChild(currentPara)
        const nextButton = document.createElement('button');
        nextButton.className = 'nav-button';
        nextButton.id = 'next';
        const rightArrow = document.createElement('i');
        rightArrow.className = 'fas fa-arrow-right';
        nextButton.appendChild(rightArrow);
        navigation.appendChild(nextButton);
        nextButton.addEventListener('click', this.nextButtonClicked.bind(this));
        const addContainer  = document.createElement('div');
        addContainer.className = 'add-container';
        addContainer.id = 'add-container';
        const h1 = document.createElement('h1');
        h1.innerHTML = 'Add New Card';
        addContainer.appendChild(h1);
        const ghostButton = document.createElement('button');
        ghostButton.setAttribute('id', 'hide')
        ghostButton.className = 'btn btn-small btn-ghost';
        const timesIcon = document.createElement('i');
        timesIcon.className = 'fas fa-times';
        ghostButton.appendChild(timesIcon);
        h1.appendChild(ghostButton);
        ghostButton.addEventListener('click', () => addContainer.classList.remove('show'))
        const formGroup1 = document.createElement('div');
        const questionLabel = document.createElement('label');
        formGroup1.className = 'form-group';
        questionLabel.setAttribute('for', 'question');
        formGroup1.appendChild(questionLabel);
        const questionTextArea = document.createElement('textarea');
        questionTextArea.setAttribute('placeholder', 'Enter question');
        questionTextArea.id = 'question'; 
        formGroup1.appendChild(questionTextArea);
        addContainer.appendChild(formGroup1 )
        const formGroup2 = document.createElement('div');
        formGroup2.className = 'form-group';
        const answerLabel = document.createElement('label');
        answerLabel.setAttribute('for', 'answer');
        formGroup2.appendChild(answerLabel)
        const answerTextArea = document.createElement('textarea');
        answerTextArea.setAttribute('placeholder', 'Enter answer');
        answerTextArea.id = 'answer';
        formGroup2.appendChild(answerTextArea);
        addContainer.appendChild(formGroup2)
        const addCardButton = document.createElement('button');
        addCardButton.id = 'add-card';
        addCardButton.className = 'btn'
        const plusIcon =  document.createElement('i')
        plusIcon.className = 'fas fa-plus';
        addCardButton.innerText = 'Add Card';
        addCardButton.addEventListener('click', this.addCardButtonClicked.bind(this))
        addCardButton.addEventListener('click', () => addContainer.classList.remove('show'))
        addContainer.appendChild(addCardButton);

        container.appendChild(signoutButton);
        container.appendChild(title);
        container.appendChild(cardsContainer);
        container.appendChild(navigation);
        container.appendChild(addContainer);
    
        return  container;
            
    }

    public listingAdd(flashcard: Flashcard, index: number) {
        const card = document.createElement("div");
        card.classList.add("card");
        if (index === 0) card.className = 'active card';
        
        const innerCard = document.createElement('div');
        innerCard.className = 'inner-card';
        card.appendChild(innerCard)
        const innerCardFront = document.createElement('div');
        innerCardFront.className = 'inner-card-front';
        innerCard.appendChild(innerCardFront)
        const questionPara = document.createElement('p');
        questionPara.innerText = flashcard.question;
        innerCardFront.appendChild(questionPara);
        const innerCardBack = document.createElement('div');
        innerCardBack.className = 'inner-card-back';
        innerCard.append(innerCardBack)
        const answerPara = document.createElement('p');
        answerPara.innerText = flashcard.answer;
        innerCardBack.appendChild(answerPara);
        const cardsContainer = document.getElementById('cards-container');
        cardsContainer!.appendChild(card);
        card.addEventListener('click', () => card.classList.toggle('show-answer'))
        this._cardsEl.push(card);
        this.updateCurrentText.call(this);
    }

    private updateCurrentText(){
        const currentEl = document.getElementById('current');
        currentEl!.innerText = `${this._currentActiveCard + 1}/${this._cardsEl.length}`;
    }

    private nextButtonClicked (){

        this._cardsEl[this._currentActiveCard].className = 'card left';
        this._currentActiveCard = this._currentActiveCard + 1;
        if (this._currentActiveCard > this._cardsEl.length - 1) {
            this._currentActiveCard = this._cardsEl.length - 1;
        }
    
        this._cardsEl[this._currentActiveCard].className = 'card active';
        this.updateCurrentText.call(this);
    }

    private prevButtonClicked (){
        this._cardsEl[this._currentActiveCard].className = 'card right';
        this._currentActiveCard = this._currentActiveCard - 1;
    
        if (this._currentActiveCard < 0) {
            this._currentActiveCard = 0;
        }
    
        this._cardsEl[this._currentActiveCard].className = 'card active';
        this.updateCurrentText.call(this);

    }

    public addCardButtonClicked() {
        const flashcardsController = new FlashcardsController();
        const question = (document.getElementById('question') as HTMLTextAreaElement).value;
        const answer   = (document.getElementById('answer') as HTMLTextAreaElement).value;
        flashcardsController.addData(question, answer)
    }

    public listingClear() {
        const container = document.getElementById('cards-container')
        if(!container) {return; }
        while( container.children.length > 0) {
            container.removeChild(container.children[0])
        }
        this._cardsEl = [];
        this._currentActiveCard = 0

        const nextButton = <HTMLElement>document.getElementById("next");
        nextButton.addEventListener('click', this.nextButtonClicked.bind(this));

        const prevButton = <HTMLElement>document.getElementById("prev");
        prevButton.addEventListener('click', this.prevButtonClicked.bind(this));
    } 
}
