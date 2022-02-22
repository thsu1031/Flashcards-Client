import { SessionToken, AccessRight } from "../models/AuthenticationModels";
import { FlashcardsService } from "../services/FlashcardsService";
import { FlashcardsView } from "../views/FlashcardsView";
import { Flashcard } from "../models/DataModels";


export class FlashcardsController {
    private sessionToken: SessionToken | undefined;
    private flashcardsService: FlashcardsService = new FlashcardsService();
    private flashcardsView: FlashcardsView = new FlashcardsView();
  
    public setSessionToken(sessionToken: SessionToken) {
        this.sessionToken = sessionToken;
    }
  
    public  createView (): HTMLDivElement {

        if (this.sessionToken) {    
            this.flashcardsView.createDOM();
            this.getData()
            localStorage.setItem('currentUser', JSON.stringify({ token: this.sessionToken }));
    
        } else {
            this.flashcardsView.createDOM();
        } 
        
        return  this.flashcardsView.createDOM();
    }

    public async getData() {
                
        const flashcardsData = await this.flashcardsService.getFlashcards( 
            this.sessionToken!.tokenId,
            this.sessionToken!.username,
        )

        console.log(flashcardsData);

        for (let i = 0; i <  flashcardsData.length; i++) {
            const flahcard: Flashcard = {
                question  : flashcardsData[i].question,
                answer    : flashcardsData[i].answer,
                isActive  : false,
                _id       : flashcardsData[i]._id,
            }

            this.flashcardsView.listingAdd(flahcard, i)
        }
    }

    public async addData(question:string, answer:string) {
   
        const localToken =  JSON.parse(localStorage.getItem('currentUser')!);
        const addFlashcardsData = await this.flashcardsService.addFlashcard( 
            localToken.token.tokenId,
            question, 
            answer, 
            localToken.token.username,
        );
       
        this.flashcardsView.listingClear();
       
        const flashcardsData = await this.flashcardsService.getFlashcards( 
            localToken.token.tokenId,
            localToken.token.username,
        )

        for (let i = 0; i <  flashcardsData.length; i++) {
            const flahcard: Flashcard = {
                question  : flashcardsData[i].question,
                answer    : flashcardsData[i].answer,
                isActive  : false,
                _id       : flashcardsData[i]._id,
            }

            this.flashcardsView.listingAdd(flahcard, i)
        }

    }
}