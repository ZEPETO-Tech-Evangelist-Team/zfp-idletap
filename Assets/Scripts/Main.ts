import { Debug, GameObject, Vector3 } from 'UnityEngine';
import { Room } from 'ZEPETO.Multiplay';
import { SchemaPlayer, State } from 'ZEPETO.Multiplay.Schema';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { Users, ZepetoWorldHelper, ZepetoWorldMultiplay } from 'ZEPETO.World';
import UIManager from './UIManager';

export interface AttackInfo {
    ownerUserId : string,
    attackAmount : number,
    lifetimeAttacks : number
}

export default class Main extends ZepetoScriptBehaviour
{
    public UIManagerGameObject : GameObject;
    public UIManager : UIManager;

    public multiplayReference: ZepetoWorldMultiplay;
    private _roomReference: Room;

    public enemyGameObject: GameObject;

    private _currentPlayers : Map<string, SchemaPlayer>;

    Start() 
    {    
        this._currentPlayers = new Map<string, SchemaPlayer>();
        this.UIManager = this.UIManagerGameObject.GetComponent<UIManager>();
        this.multiplayReference.RoomJoined += (room: Room) => {

            this._roomReference = room;

            this._roomReference.OnStateChange += this.OnStateChange;
        };
    }

    public SaveData() {
        this._roomReference.Send("CLIENT_SAVEDATA_REQUEST_MESSAGE", null);
    }

    public LoadData() {
        this._roomReference.Send("CLIENT_LOADDATA_REQUEST_MESSAGE", null);
    }

    //Attacks
    public SendAttackMessageToServer() {
        let damageAmount: number = 1;
        this._roomReference.Send("CLIENT_ATTACK_MESSAGE", damageAmount);
    }

    public Attack() {
        this.enemyGameObject.transform.localScale = new Vector3(4, this._roomReference.State.enemy.health, 4);

        if (this.enemyGameObject.transform.localScale.y === 0) {
            this.enemyGameObject.transform.localScale = new Vector3(4, 15, 4);
        }
    }

    /** multiplayer Spawn **/
    private OnStateChange(state: State, isFirst: boolean) {
        if (isFirst) {
            state.enemy.OnChange += this.Attack;
            this.Attack();
        }
        const join = new Map<string, SchemaPlayer>();
        const leave = new Map<string, SchemaPlayer>(this._currentPlayers);

        state.schemaPlayers.ForEach((userId: string, player: SchemaPlayer) => {
            if (!this._currentPlayers.has(userId)) {
                this._currentPlayers.set(userId, player);
                join.set(userId, player);
            }
            leave.delete(userId);
        });

        // [RoomState] Create a player instance for players that enter the Room
        join.forEach((schemaPlayer: SchemaPlayer, userId: string) => this.OnJoinPlayer(userId, schemaPlayer));

        // [RoomState] Remove the player instance for players that exit the room
        leave.forEach((schemaPlayer: SchemaPlayer, userId: string) => this.OnLeavePlayer(userId, schemaPlayer));

        this.UpdateUI();
    }

    private OnJoinPlayer(userId : string, schemaPlayer : SchemaPlayer) {
        this.UIManager.AddUserInfoPanel(userId);
    }

    private OnLeavePlayer(userId : string, schemaPlayer : SchemaPlayer) {
        this._currentPlayers.delete(userId);
        this.UIManager.RemoveUserInfoPanel(userId);
    }

    private UpdateUI() {
        this._currentPlayers.forEach((player : SchemaPlayer, userId : string) => {
            this.UIManager.UserInfoPanels.get(userId).UpdateLifetimeAttacks(player.attackCount);
        });
    }
}