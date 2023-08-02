import { TextMeshProUGUI } from 'TMPro';
import { Debug, Rect, Sprite, Texture, Texture2D, Vector2 } from 'UnityEngine';
import { Image } from 'UnityEngine.UI';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { ZepetoWorldHelper } from 'ZEPETO.World';

export default class UserInfoPanel extends ZepetoScriptBehaviour {
    public profileImage : Image;
    public lifetimeHitsText : TextMeshProUGUI;

    public InitUserInfoPanel(userId : string) {
        ZepetoWorldHelper.GetProfileTexture(userId, (texture: Texture) => {
            this.profileImage.sprite = this._getSprite(texture);
        
        }, (error) => {
            Debug.LogError(error);
        });
    }

    public UpdateLifetimeAttacks(lifeTimeAmount : number) {
        this.lifetimeHitsText.text = lifeTimeAmount.toString();
    }

    private _getSprite(texture: Texture) {
        let rect: Rect = new Rect(0, 0, texture.width, texture.height);
        return Sprite.Create(texture as Texture2D, rect, new Vector2(0.5, 0.5));
    }
}