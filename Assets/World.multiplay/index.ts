import { Sandbox, SandboxOptions, SandboxPlayer, SystemError } from "ZEPETO.Multiplay";
import { DataStorage, DataStorageError } from "ZEPETO.Multiplay.DataStorage";
import { SchemaPlayer } from "ZEPETO.Multiplay.Schema";

export interface AttackInfo {
    ownerUserId : string,
    attackAmount : number,
    lifetimeAttacks : number
}

export default class extends Sandbox {
    //private _currentPlayers : Map<string, SchemaPlayer>;

    onCreate(options: SandboxOptions) {
        this.onMessage("CLIENT_ATTACK_MESSAGE", (client: SandboxPlayer, message: number) => {
            this.state.schemaPlayers.get(client.userId)?.attackCount;
            // Triggers when 'action' message is sent.
            // Broadcast a message to all clients


            this.GetAttackCount(client).then((number) => {
                if (number) 
                {
                    this.SetAttackCount(client, number + message).then(() => {
                        let attackInfo = {
                            ownerUserId : client.userId,
                            attackAmount : message,
                            lifetimeAttacks : number + message,
                        } as AttackInfo;

                        this.broadcast("SERVER_ATTACK_MESSAGE", attackInfo);
                    });
                }
                else 
                {

                    this.SetAttackCount(client, message).then(() => {
                        let attackInfo = {
                            ownerUserId : client.userId,
                            attackAmount : message,
                            lifetimeAttacks : message,
                        } as AttackInfo;

                        this.broadcast("SERVER_ATTACK_MESSAGE", attackInfo);
                    });
                }

            });
        });
    }

    onJoin(client: SandboxPlayer) {
        console.log("onJoin");
        const schemaPlayer : SchemaPlayer = new SchemaPlayer();
        schemaPlayer.userId = client.userId;
        this.state.schemaPlayers.set(client.userId, schemaPlayer);
    }

    onLeave(client: SandboxPlayer, consented?: boolean) {
        this.state.schemaPlayers.delete(client.userId);
    }

    async SetAttackCount(client : SandboxPlayer, attackCount : number) 
    {

        const playerStorage : DataStorage = client.loadDataStorage();

        try 
        {
            const success : boolean = await playerStorage.set("attackCount", attackCount);
            if (success) {
                console.log(`[SetAttackCount] ${attackCount}`);
            }
        }

        catch(error) 
        {
            let systemError = (error as SystemError);
            
            if (systemError.code === DataStorageError.Unknown.toString() || systemError.code === DataStorageError.NetworkError.toString()) 
            {
                console.log(systemError.message);
            }
            else if (systemError.code === DataStorageError.KeyConstraintViolated.toString()) 
            {
                console.log(systemError.message);
            }
            else if (systemError.code === DataStorageError.ValueConstraintViolated.toString()) 
            {
                console.log(systemError.message);
            }
        }
    }

    async GetAttackCount(client : SandboxPlayer) : Promise<number | null> {

        const playerStorage : DataStorage = client.loadDataStorage();

        try 
        {
            const attackCount : number = await playerStorage.get("attackCount");
            if (attackCount) {
                return attackCount;
            }
        }

        catch(error) 
        {
            let systemError = (error as SystemError);
            
            if (systemError.code === DataStorageError.Unknown.toString() || systemError.code === DataStorageError.NetworkError.toString()) 
            {
                console.log(systemError.message);
            }
            else if (systemError.code === DataStorageError.KeyConstraintViolated.toString()) 
            {
                console.log(systemError.message);
            }
            else if (systemError.code === DataStorageError.ValueConstraintViolated.toString()) 
            {
                console.log(systemError.message);
            }
        }

        return null;
    }

}