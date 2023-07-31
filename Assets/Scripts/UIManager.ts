import { Debug, GameObject, Quaternion, Resources, Vector3 } from 'UnityEngine';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import UserInfoPanel from './UserInfoPanel';
import { TMP_FontAssetUtilities } from 'TMPro';
import { Slider } from 'UnityEngine.UI';

export default class UIManager extends ZepetoScriptBehaviour {
    public UserInfoPanels : Map<string, UserInfoPanel>;
    public UserInfoPanelsParent : GameObject;

    Start() {
        this.UserInfoPanels = new Map<string, UserInfoPanel>();
    }
    
    AddUserInfoPanel(userId : string) {
        if (this.UserInfoPanels.has(userId) === false) {
            const userInfoPanelGameObject : GameObject = GameObject.Instantiate(Resources.Load<GameObject>("UserInfoPanel"), this.transform.position, Quaternion.identity) as GameObject;
            userInfoPanelGameObject.transform.SetParent(this.UserInfoPanelsParent.transform);
            userInfoPanelGameObject.transform.localScale = new Vector3(1,1,1);
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