import { ZepetoScriptBehaviour } from 'ZEPETO.Script'

export default class AsyncAwaitExample extends ZepetoScriptBehaviour {
    Delay (milliseconds) {
        return new Promise(resolve => {
            setTimeout(resolve, milliseconds);
        });
    }

    async MockLoadNumber() : Promise<number> {
        await this.Delay(3000);
        return 10;
    }

    async Init() {
        console.log("Executed now");

        await this.Delay(1000);
    
        console.log("Executed after 1 second wait");
    
        await this.Delay(1000);
    
        console.log("Executed after 2 seconds wait");
    }

    Start() {
        this.Init();
        console.log("Executed after the 1st log and before the 2 delays");

        this.GetDataFromMockServer();
        console.log("Executed before GetDataFromMockServer returns");
    }

    async GetDataFromMockServer() : Promise<number> {
        const myNumber : number = await this.MockLoadNumber();
        console.log("[GetDataFromMockServer] response: " + myNumber);
        return myNumber;
    }
}