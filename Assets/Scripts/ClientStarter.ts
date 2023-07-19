import { GameObject, Vector3 } from 'UnityEngine';
import { Room } from 'ZEPETO.Multiplay';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { ZepetoWorldMultiplay } from 'ZEPETO.World';

export default class ClientStarter extends ZepetoScriptBehaviour
{
    public multiplayReference: ZepetoWorldMultiplay;
    public roomReference: Room;

    public enemyGameObject: GameObject;

    Start() 
    {    
        this.multiplayReference.RoomJoined += (room: Room) => {
            // Make reference to room
            this.roomReference = room;

            // Add server message listener type by "attack"
            room.AddMessageHandler("SERVER_ATTACK_MESSAGE", (message: number) => {

                // Print server message
                console.log(message);

                // Execute server message
                this.Attack(message);
            });
        };
    }

    public SendAttackMessageToServer() {
        let damageAmount: number = 1;
        this.roomReference.Send("CLIENT_ATTACK_MESSAGE", damageAmount);
    }

    public Attack(attackAmount: number) {
        let height = this.enemyGameObject.transform.localScale.y;
        this.enemyGameObject.transform.localScale = new Vector3(4, height - attackAmount, 4);

        if (this.enemyGameObject.transform.localScale.y === 0) {
            this.enemyGameObject.transform.localScale = new Vector3(4, 15, 4);
        }
    }
}