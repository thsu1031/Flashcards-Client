import { Flashcard } from "../models/DataModels";

const baseUrl=  "http://localhost:8080/";
const flashcardsUrl = baseUrl + "flashcards";

export class FlashcardsService  {
    public async getFlashcards(authorization:string, nameQuery: string) {

        const url = flashcardsUrl + '?username=' + nameQuery;
        const options = {
            method: 'GET',
            headers: {
                Authorization: authorization

            }
        }
        const result = await fetch(url, options);
        const resultJson = await result.json();

        if(result.status !== 401) {
            return resultJson;
        } else {
            window.location.href = "#/login";
           
        }
      
    }

    public async addFlashcard(authorization:string, question:string, answer:string, username:string) {
        const url  = flashcardsUrl
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
                username : username,
               
            })
        }
        
        const result = await fetch(url, options);

        if (result.status == 201) {
            return await result.json();
        } else {
            return null;
        }
    }
    
}


