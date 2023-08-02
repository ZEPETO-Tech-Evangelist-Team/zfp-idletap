import { SandboxPlayer, SystemError } from "ZEPETO.Multiplay";
import { IModule } from "../IModule";
import { DataStorage } from "ZEPETO.Multiplay.DataStorage";

export interface DSCustomData {
    ownerUserId : string,
    attackAmount : number,
    lifetimeAttacks : number
}

export default class DataStoreLessonModule extends IModule {

    async OnCreate() {
        this.server.onMessage("LOAD_SAVE_DATA", (client: SandboxPlayer, message: number) => {
            console.log("load save data");
            this.LoadSaveData(client, message);
            this.TryCatch_LoadSaveData(client, message);
        });

        this.server.onMessage("LOAD_SAVE_CUSTOM_DATA", (client: SandboxPlayer, message: number) => {
            this.LoadSaveCustomData(client, 0);
        });

        this.server.onMessage("MULTI_LOAD_SAVE_CUSTOM_DATA", (client: SandboxPlayer, message: number) => {
            this.MultiLoadSaveCustomData(client, message);
        });
    }

    async OnJoin(client: SandboxPlayer) {

    }

    async OnLeave(client: SandboxPlayer) {

    }

    OnTick(deltaTime : number) {

    }

    //Load Save primitive data type
    async LoadSaveData(client : SandboxPlayer, level : number) {
        const playerStorage: DataStorage = client.loadDataStorage();
        let playerLevel : number = await playerStorage.get("level") as number;
     
        if (playerLevel === null || playerLevel === undefined) {
            playerLevel = 0;
        }

        await playerStorage.set("level", playerLevel + 1);

        console.log(`playerLevel: ${await playerStorage.get("level") as number}`);
    }

    //Load Save primitive data type
    //Try Catch block example
    async TryCatch_LoadSaveData(client : SandboxPlayer, level : number) {
        const playerStorage: DataStorage = client.loadDataStorage();

        try
        {
            let playerLevel : number = await playerStorage.get("level") as number;
     
            if (playerLevel === null || playerLevel === undefined) {
                playerLevel = 0;
            }
    
            await playerStorage.set("level", playerLevel + 1);
    
            console.log(`playerLevel: ${await playerStorage.get("level") as number}`);
        }
        catch(error)
        {
            console.log(error);
        }
    }

    //Load Save custom data type
    async LoadSaveCustomData(client : SandboxPlayer, message : number) {
        const playerStorage: DataStorage = client.loadDataStorage();
        try 
        {
            let dSCustomData : DSCustomData = await playerStorage.get("dSCustomData") as DSCustomData;

            //!!!Reason for Try Catch!!!
            //Below code would cause an undefined error because attackAmount is undefined. This in turn would cause code after the undefined error to not run.
            //The catch block would be used to handle the error, or notify you that an undefined error has occured
            //console.log(dSCustomData.attackAmount);  //CODE TO UNCOMMENT TO SEE UNDEFINED ERROR
    
            if (dSCustomData === null || dSCustomData === undefined) {
                dSCustomData = { ownerUserId : "123", attackAmount : 10, lifetimeAttacks : 20 };
                await playerStorage.set(client.userId, dSCustomData);
            }
    
            await playerStorage.set("dSCustomData", dSCustomData);

            console.log(dSCustomData);
        } 
        catch(error) 
        {
            let systemError = (error as SystemError);
            console.log(error);
            console.log(systemError);
            console.log(systemError.code);
            console.log(systemError.message);
        }
    }

    //Multi Load Save custom data type
    async MultiLoadSaveCustomData(client : SandboxPlayer, message : number) {
        const playerStorage : DataStorage = client.loadDataStorage();

        const dSCustomData_1 : DSCustomData = { ownerUserId : "1", attackAmount : 10, lifetimeAttacks : 100 };
        const dSCustomData_2 : DSCustomData = { ownerUserId : "2", attackAmount : 20, lifetimeAttacks : 200 };

        try
        {
            const success = await playerStorage.mset<DSCustomData>([
                {
                    key: "key1",
                    value: dSCustomData_1
                },
                {
                    key: "key2",
                    value: dSCustomData_2
                }  
            ]);

            if (success) {
                // Get the values of key1 and key2 at once
                const keys = ['key1', 'key2'];
                const keyValues = await playerStorage.mget<DSCustomData>(keys);
                keys.forEach(key => {
                    const value : DSCustomData = keyValues[key];
                    if (key === 'key1' && value !== null && value !== undefined) {
                        console.log(`ownerUserId: ${value.ownerUserId}, attackAmount: ${value.attackAmount}, lifetimeAttacks: ${value.lifetimeAttacks}`);
                    } else if (key === 'key2' && value !== null && value !== undefined) {
                        console.log(`ownerUserId: ${value.ownerUserId}, attackAmount: ${value.attackAmount}, lifetimeAttacks: ${value.lifetimeAttacks}`);
                    }
                });
            }
        }
        catch(error)
        {
            console.log(error);
        }
    }

    async SavingJSON() {

    }
}