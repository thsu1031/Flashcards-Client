import { SessionToken } from "../models/AuthenticationModels";
const baseUrl = 'http://localhost:8080/';
const signupUrl  = baseUrl +  'signup';

export class SignUpService {
    public async signup(userName: string, password: string): Promise<SessionToken | undefined> {
        const options = {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: userName,
                password: password,
            })
        }

        const result = await fetch(signupUrl, options);
     
        if (result.status == 201) {
            return await result.json();
        } else {
            return undefined;
        }
    }
}