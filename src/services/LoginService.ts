import { SessionToken } from "../models/AuthenticationModels";
const baseUrl = 'http://localhost:8080/';
const loginUrl = baseUrl + 'login';

export class LoginService {

    public async login(userName: string, password: string): Promise<SessionToken | undefined> {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: userName,
                password: password
            })
        }

        const result = await fetch(loginUrl, options);
        if (result.status == 201) {
            return await result.json();
        } else {
            return undefined;
        }
    }
}
