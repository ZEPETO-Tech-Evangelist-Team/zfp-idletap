import { GameObject, Vector3 } from 'UnityEngine';
import { Slider } from 'UnityEngine.UI'
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { ENEMY_START_HEALTH } from './Main';

export default class Enemy extends ZepetoScriptBehaviour {
    public BodyGO : GameObject;
    public HealthBar : Slider;

    public UpdateEnemy(health : number) {
        this.BodyGO.transform.localScale = new Vector3(4, health, 4);
        this.HealthBar.value = health;

        if (this.BodyGO.transform.localScale.y === 0) {
            this.BodyGO.transform.localScale = new Vector3(4, ENEMY_START_HEALTH, 4);
            this.HealthBar.value = ENEMY_START_HEALTH;
        }
    }

}