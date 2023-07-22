import { TextMeshProUGUI } from 'TMPro';
import { Debug, Rect, Sprite, Texture, Texture2D, Vector2 } from 'UnityEngine';
import { Image } from 'UnityEngine.UI';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { ZepetoWorldHelper } from 'ZEPETO.World';

export default class UserInfoPanel extends ZepetoScriptBehaviour {
    public profileImage : Image;
    public lifetimeHitsText : TextMeshProUGUI;
    public hitsText : TextMeshProUGUI;
    private _hitsAmount : number;

    InitUserInfoPanel(userId : string) { 
        this._hitsAmount = 0; 
        ZepetoWorldHelper.GetProfileTexture(userId, (texture: Texture) => {
            this.profileImage.sprite = this.GetSprite(texture);
        
        }, (error) => {
            Debug.LogError(error);
        });
    }

    GetSprite(texture: Texture) {
        let rect: Rect = new Rect(0, 0, texture.width, texture.height);
        return Sprite.Create(texture as Texture2D, rect, new Vector2(0.5, 0.5));
    }

    UpdateCurrentAttacks(currentAmount : number) {
        this._hitsAmount += currentAmount;
        this.hitsText.text = this._hitsAmount.toString();
    }

    UpdateLifetimeAttacks(lifeTimeAmount : number) {
        this.lifetimeHitsText.text = lifeTimeAmount.toString();
    }

}