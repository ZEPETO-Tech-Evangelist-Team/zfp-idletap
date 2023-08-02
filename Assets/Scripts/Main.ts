import { GameObject, Vector3 } from 'UnityEngine';
import { Room } from 'ZEPETO.Multiplay';
import { SchemaPlayer, State } from 'ZEPETO.Multiplay.Schema';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { ZepetoWorldMultiplay } from 'ZEPETO.World';
import UIManager from './UIManager';
import Enemy from './Enemy';

export const ENEMY_START_HEALTH = 15;

export default class Main extends ZepetoScriptBehaviour
{
    public UIManagerGO : GameObject;
    public EnemyGO: GameObject;
    public MultiplayReference: ZepetoWorldMultiplay;

    private static _main : Main;

    private _currentPlayers : Map<string, SchemaPlayer>;

    private _uIManager : UIManager;
    private _enemy : Enemy;
    private _roomReference: Room;

    Awake() {
        Main._main = this;
    }

    Start() {
        //initialize _currentPlayers Map
        this._currentPlayers = new Map<string, SchemaPlayer>();

        //cache reference to UIManager;
        this._uIManager = this.UIManagerGO.GetComponent<UIManager>();

        //cache reference to Enemy
        this._enemy = this.EnemyGO.GetComponent<Enemy>();

        //register callback method for ZepetoWorldMultiplay.RoomJoined
        this.MultiplayReference.RoomJoined += (room: Room) => {

            //cache reference to Room
            this._roomReference = room;

            //register callback method for Room.OnStateChange
            this._roomReference.OnStateChange += this._onStateChange;
        };
    }
    
    //Static functon to access Main
    public static GetInstance() : Main {
        return this._main;
    }

    public AttackEnemy() {
        let damageAmount: number = 1;
        this._roomReference.Send("CLIENT_ATTACK_MESSAGE", damageAmount);
    }

    private _updatePlayers() {
        this._uIManager.UpdatePlayers(this._currentPlayers);
    }

    private _updateEnemy() {
        this._enemy.UpdateEnemy(this._roomReference.State.schemaEnemy.health);
    }

    //Function registered to Room.OnStateChange
    private _onStateChange(state: State, isFirst: boolean) {
        if (isFirst) {
            //Register _updateEnemy() callback function when the schemaEnemy changes
            state.schemaEnemy.OnChange += this._updateEnemy;
            this._updateEnemy();
        }

        this._updatePlayersMap(state);

        this._updatePlayers();
    }

    //This function is responsible for keeping _currentPlayers map up to date with the players still in the Room
    private _updatePlayersMap(state : State) {
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
        join.forEach((schemaPlayer: SchemaPlayer, userId: string) => this._onJoinPlayer(userId, schemaPlayer));

        // [RoomState] Remove the player instance for players that exit the room
        leave.forEach((schemaPlayer: SchemaPlayer, userId: string) => this._onLeavePlayer(userId, schemaPlayer));
    }

    //Add player UI when player joins
    private _onJoinPlayer(userId : string, schemaPlayer : SchemaPlayer) {
        this._uIManager.AddUserInfoPanel(userId);
    }

    //Remove player UI when player leaves
    private _onLeavePlayer(userId : string, schemaPlayer : SchemaPlayer) {
        this._currentPlayers.delete(userId);
        this._uIManager.RemoveUserInfoPanel(userId);
    }
}