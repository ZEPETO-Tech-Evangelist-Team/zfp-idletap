import { Debug, GameObject, Vector3 } from 'UnityEngine';
import { Room } from 'ZEPETO.Multiplay';
import { SchemaEnemy, SchemaPlayer, State } from 'ZEPETO.Multiplay.Schema';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { Users, ZepetoWorldHelper, ZepetoWorldMultiplay } from 'ZEPETO.World';
import UIManager from './UIManager';
import Enemy from './Enemy';

//Topics
//Send Messages
//Schema
//Datastorage
//OnStateChange
//Onchange

export interface AttackInfo {
    ownerUserId : string,
    attackAmount : number,
    lifetimeAttacks : number
}

export const ENEMY_START_HEALTH = 15;

export default class Main extends ZepetoScriptBehaviour
{
    public UIManagerGameObject : GameObject;
    public UIManager : UIManager;

    public EnemyGameObject: GameObject;
    public Enemy : Enemy;

    public multiplayReference: ZepetoWorldMultiplay;
    private _roomReference: Room;

    private _currentPlayers : Map<string, SchemaPlayer>;

    Start() 
    {   
        this._currentPlayers = new Map<string, SchemaPlayer>();
        this.UIManager = this.UIManagerGameObject.GetComponent<UIManager>();
        this.Enemy = this.EnemyGameObject.GetComponent<Enemy>();

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
        this.Enemy.Attack(this._roomReference.State.schemaEnemy.health);
    }

    /** multiplayer Spawn **/
    private OnStateChange(state: State, isFirst: boolean) {
        console.log("on state change");
        if (isFirst) {
            state.schemaEnemy.OnChange += this.Attack;
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