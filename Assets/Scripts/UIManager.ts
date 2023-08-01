import { GameObject, Quaternion, Resources, Vector3 } from 'UnityEngine';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import UserInfoPanel from './UserInfoPanel';
import { Button } from 'UnityEngine.UI';
import Main from './Main';
import { SchemaPlayer } from 'ZEPETO.Multiplay.Schema';

export default class UIManager extends ZepetoScriptBehaviour {
    
    public UserInfoPanelsParent : GameObject;
    public AttackButton : Button;

    private _userInfoPanels : Map<string, UserInfoPanel>;

    Start() {
        this._userInfoPanels = new Map<string, UserInfoPanel>();
        this.AttackButton.onClick.AddListener(() => {Main.GetInstance().AttackEnemy()});
    }

    public UpdatePlayers(currentPlayers : Map <string, SchemaPlayer>) {
        currentPlayers.forEach((value, key) => {
            this._userInfoPanels.get(key).UpdateLifetimeAttacks(value.attackCount);
        });
    }
    
    public AddUserInfoPanel(userId : string) {
        if (this._userInfoPanels.has(userId) === false) {
            const userInfoPanelGameObject : GameObject = GameObject.Instantiate(Resources.Load<GameObject>("UserInfoPanel"), this.transform.position, Quaternion.identity) as GameObject;
            userInfoPanelGameObject.transform.SetParent(this.UserInfoPanelsParent.transform);
            userInfoPanelGameObject.transform.localScale = new Vector3(1,1,1);
            const userInfoPanel : UserInfoPanel = userInfoPanelGameObject.GetComponent<UserInfoPanel>();
            userInfoPanel.InitUserInfoPanel(userId);
            this._userInfoPanels.set(userId, userInfoPanel);
        }
    }

    public RemoveUserInfoPanel(userId : string) {
        GameObject.Destroy(this._userInfoPanels.get(userId).gameObject);
        this._userInfoPanels.delete(userId);
    }
}