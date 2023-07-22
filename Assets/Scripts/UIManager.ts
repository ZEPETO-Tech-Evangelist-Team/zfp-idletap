import { Debug, GameObject, Quaternion, Resources } from 'UnityEngine';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import UserInfoPanel from './UserInfoPanel';
import { TMP_FontAssetUtilities } from 'TMPro';

export default class UIManager extends ZepetoScriptBehaviour {
    public UserInfoPanels : Map<string, UserInfoPanel>;
    public UserInfoPanelsParent : GameObject;

    Start() {
        this.UserInfoPanels = new Map<string, UserInfoPanel>();
    }
    
    AddUserInfoPanel(userId : string) {
        if (this.UserInfoPanels.has(userId) === false) {
            const userInfoPanelGameObject : GameObject = GameObject.Instantiate(Resources.Load<GameObject>("UserInfoPanel"), this.transform.position, Quaternion.identity) as GameObject;
            userInfoPanelGameObject.transform.parent = this.UserInfoPanelsParent.transform;
            const userInfoPanel : UserInfoPanel = userInfoPanelGameObject.GetComponent<UserInfoPanel>();
            userInfoPanel.InitUserInfoPanel(userId);
            this.UserInfoPanels.set(userId, userInfoPanel);
        }
    }

    RemoveUserInfoPanel(userId : string) {
        GameObject.Destroy(this.UserInfoPanels.get(userId).gameObject);
        this.UserInfoPanels.delete(userId);
    }

}