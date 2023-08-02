import { Button } from 'UnityEngine.UI';
import { Room } from 'ZEPETO.Multiplay';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { ZepetoWorldMultiplay } from 'ZEPETO.World';

export default class DataStoreLessonClient extends ZepetoScriptBehaviour {
    public MultiplayReference: ZepetoWorldMultiplay;
    private _roomReference: Room;

    public LoadSaveDataButton: Button;
    public LoadSaveCustomDataButton : Button;
    public MultiLoadSaveCustomDataButton : Button;
   
    Start() {  

        this.LoadSaveDataButton.onClick.AddListener(() => {
            this._loadSaveData();
        });

        this.LoadSaveCustomDataButton.onClick.AddListener(() => {
            this._loadSaveCustomData();
        });

        this.MultiLoadSaveCustomDataButton.onClick.AddListener(() => {
            this._multiLoadSaveCustomData();
        });

        this.MultiplayReference.RoomJoined += (room: Room) => {

            //cache reference to Room
            this._roomReference = room;
        };
    }

    private _loadSaveData() {
        this._roomReference.Send("LOAD_SAVE_DATA", ""); 
    }

    private _loadSaveCustomData() {
        this._roomReference.Send("LOAD_SAVE_CUSTOM_DATA", ""); 
    }

    private _multiLoadSaveCustomData() {
        this._roomReference.Send("MULTI_LOAD_SAVE_CUSTOM_DATA", ""); 
    }

}