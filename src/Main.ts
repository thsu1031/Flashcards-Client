import { HashRouter} from "./Router";

export class Main {
    private router: HashRouter = new HashRouter();
  
    public constructor() {
        console.log(`Constructored new Instance of the program`);
    }

    public launchApp() {
		const localToken =  JSON.parse(localStorage.getItem('currentUser')!);

        let container = document.getElementById("main-container") as HTMLElement;
        this.router.registerIndex(() => (this.router.homepageView()));
        this.router.register("/login", () => ( this.router.switchToLoginView()));
        

        if(localToken !== null) {
            this.router.register("/flashcards", () => (this.router.switchToFlashcardsView(localToken.token)));
        } else {
        
            this.router.register("/flashcards", () => ( this.router.switchToLoginView()));

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