import { Button } from 'UnityEngine.UI'
import { Room, RoomData } from 'ZEPETO.Multiplay';
import { State } from 'ZEPETO.Multiplay.Schema';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { ZepetoWorldMultiplay } from 'ZEPETO.World';

interface MessageModel {
    str: string,
    isTest: boolean
}

export default class SendMessageLessonClient extends ZepetoScriptBehaviour {
    public SendSimpleMessageButton : Button;
    public SendCustomMessageButton : Button;
    public SendRoomDataMessageButton : Button;
    public SendUpdateSchemaStateMessageButton : Button;
    public SendUpdateSchemaEnemyMessaageButton : Button;

    public MultiplayReference: ZepetoWorldMultiplay;
    private _roomReference : Room;

    Start() {    
        this.SendSimpleMessageButton.onClick.AddListener(() => {
            this._sendSimpleMessage();
        });
        this.SendCustomMessageButton.onClick.AddListener(() => {
            this._sendCustomMessage();
        });
        this.SendRoomDataMessageButton.onClick.AddListener(() => {
            this._sendRoomDataMessage();
        });

        this.SendUpdateSchemaStateMessageButton.onClick.AddListener(() => {
            this._sendUpdateSchemaStateMessage();
        });

        this.SendUpdateSchemaEnemyMessaageButton.onClick.AddListener(() => {
            this._sendUpdateSchemaEnemyMessage();
        });

        this.MultiplayReference.RoomJoined += (room: Room) => {

            //cache reference to Room
            this._roomReference = room;

            //register callback method for Room.OnStateChange
            this._roomReference.OnStateChange += this._onStateChange;

            this._roomReference.AddMessageHandler("SIMPLE_MESSAGE", (message : string) => {
                console.log(`[SIMPLE_MESSAGE] received from server, message: ${message}`);
            });

            this._roomReference.AddMessageHandler("CUSTOM_MESSAGE", (message : MessageModel) => {
                console.log(`[CUSTOM_MESSAGE] received from server, str: ${message.str} isTest: ${message.isTest}`);
            });

            this._roomReference.AddMessageHandler("ROOM_DATA_MESSAGE", (message) => {
                console.log(`[CUSTOM_MESSAGE] received from server, someString: ${message["someString"]} someNumber: ${message["someNumber"]} someBoolean: ${message["someBoolean"]}`);
            });
        };
    }

    private _sendSimpleMessage() {
        this._roomReference.Send("SIMPLE_MESSAGE", "Hello Server");
    }

    private _sendRoomDataMessage() {
        const myRoomData = new RoomData();
        myRoomData.Add("someString", "Bob Data");
        myRoomData.Add("someNumber", 100);
        myRoomData.Add("someBoolean", true);

        this._roomReference.Send("ROOM_DATA_MESSAGE", myRoomData.GetObject());
    }

    private _sendCustomMessage() {
        let message = {str:"Hello There!", isTest: true} as MessageModel;
        this._roomReference.Send("CUSTOM_MESSAGE", message);
    }

    private _sendUpdateSchemaStateMessage() {
        this._roomReference.Send("UPDATE_SCHEMA_STATE_MESSAGE", "");
    }

    private _sendUpdateSchemaEnemyMessage() {
        this._roomReference.Send("UPDATE_SCHEMA_ENEMY_MESSAGE", "");
    }

    private _onStateChange(state: State, isFirst: boolean) {
        if (isFirst) {
            state.schemaEnemy.OnChange += this._onSchemaEnemyChange;
        }
        console.log("on state change");

        console.log(this._roomReference.State.schemaNumber);
    }

    private _onSchemaEnemyChange() {
        console.log("on schema enemy change"); 

        console.log(this._roomReference.State.schemaEnemy.health);
    }

}