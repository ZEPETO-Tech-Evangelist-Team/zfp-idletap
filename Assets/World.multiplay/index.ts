import { Sandbox, SandboxOptions, SandboxPlayer } from "ZEPETO.Multiplay";
import { IModule } from "./ServerModule/IModule";
import { DataStorage } from "ZEPETO.Multiplay.DataStorage";
import { SchemaPlayer } from "ZEPETO.Multiplay.Schema";
import MessageLessonModule from "./ServerModule/Modules/MessageLessonModule";
import DataStoreLessonModule from "./ServerModule/Modules/DataStoreLessonModule";

export interface AttackInfo {
    ownerUserId : string,
    attackAmount : number,
    lifetimeAttacks : number
}

export const ENEMY_START_HEALTH = 15;

export default class extends Sandbox {
    private readonly _modules: IModule[] = [];

    async onCreate(options: SandboxOptions) {
        this._modules.push(new MessageLessonModule(this));
        this._modules.push(new DataStoreLessonModule(this));
        for (const module of this._modules) {
            await module.OnCreate();
        }

        this.state.schemaEnemy.health = ENEMY_START_HEALTH;
        this.state.schemaNumber = 0;

        this.onMessage("CLIENT_ATTACK_MESSAGE", (client: SandboxPlayer, message: number) => {
            console.log("CLIENT_ATTACK_MESSAGE received");
            const schemaPlayer : SchemaPlayer | undefined = this.state.schemaPlayers.get(client.userId);
            if (schemaPlayer) {
                schemaPlayer.attackCount += message;
            }

            this.state.schemaEnemy.health -= message;
            if (this.state.schemaEnemy.health === 0) {
                this.state.schemaEnemy.health = ENEMY_START_HEALTH;
            }
        });
    }

    async onJoin(client: SandboxPlayer) {
        console.log("onJoin");

        let attackCount : number = await this.LoadData(client);

        if (!attackCount) {
            attackCount = 0;
        }

        const schemaPlayer : SchemaPlayer = new SchemaPlayer();
        schemaPlayer.userId = client.userId;
        schemaPlayer.attackCount = attackCount;
        this.state.schemaPlayers.set(client.userId, schemaPlayer);
    }

    async onLeave(client: SandboxPlayer, consented?: boolean) {
        console.log("onLeave");

        const schemaPlayer = this.state.schemaPlayers.get(client.userId);

        if (schemaPlayer) {
            await this.SaveData(client, schemaPlayer.attackCount);
        }

        this.state.schemaPlayers.delete(client.userId);
    }

    async LoadData(client : SandboxPlayer) : Promise<number> {
        const playerStorage : DataStorage = client.loadDataStorage();

        let attackCount : number = await playerStorage.get("attackCount");

        const schemaPlayer : SchemaPlayer | undefined = this.state.schemaPlayers.get(client.userId);

        if (schemaPlayer) {
            schemaPlayer.attackCount = attackCount;
        }

        return attackCount;
    }

    async SaveData(client :SandboxPlayer, attackCount : number) : Promise<void> {
        const playerStorage : DataStorage = client.loadDataStorage();

        await playerStorage.set("attackCount", attackCount);
    }

}