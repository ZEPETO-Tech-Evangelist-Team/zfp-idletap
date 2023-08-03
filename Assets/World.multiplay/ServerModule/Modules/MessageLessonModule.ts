import { SandboxPlayer } from "ZEPETO.Multiplay";
import { IModule } from "../IModule";

interface MessageModel {
    str: string,
    isTest: boolean
}

export default class MessageLessonModule extends IModule {

    async OnCreate() {
        this.server.onMessage("SIMPLE_MESSAGE", (client, message) => {
            console.log(`[SIMPLE_MESSAGE] received on SERVER, message: ${message}`);

            client.send("SIMPLE_MESSAGE", message);
        });

        this.server.onMessage<MessageModel>("CUSTOM_MESSAGE", (client, message : MessageModel) => {
            console.log(`[CUSTOM_MESSAGE] received on SERVER, str: ${message.str} isTest: ${message.isTest}`);

            client.send("CUSTOM_MESSAGE", message);
        });

        this.server.onMessage("ROOM_DATA_MESSAGE", (client, message) => {
            console.log(`[ROOM_DATA_MESSAGE] received on SERVER, someString: ${message.someString} someNumber: ${message.someNumber} someBoolean: ${message.someBoolean}`);

            client.send("ROOM_DATA_MESSAGE", message);
        });

        this.server.onMessage("UPDATE_SCHEMA_STATE_MESSAGE", (client, message) => {
            if (!this.server.state.schemaNumber) {
                this.server.state.schemaNumber = 0;
            } 
            this.server.state.schemaNumber += 1;
        })

        this.server.onMessage("UPDATE_SCHEMA_ENEMY_MESSAGE", (client, message) => {
            this.server.state.schemaEnemy.health += 1;
        })
    }

    async OnJoin(client: SandboxPlayer) {

    }

    async OnLeave(client: SandboxPlayer) {

    }

    OnTick(deltaTime : number) {

    }

}