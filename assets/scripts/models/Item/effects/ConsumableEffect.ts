import { ConsumableType } from "../ItemData";
import { IEffectTarget, ItemEffect } from "./ItemEffect";

export class ConsumableEffect extends ItemEffect {
  constructor(
    private amount: number,
    private type: ConsumableType,
  ) {
    super();
  }
  public apply(target: IEffectTarget): void {
    switch (this.type) {
      case "HP Potion":
        target.healHp(this.amount);
        break;
      case "MP Potion":
        target.healMp(this.amount);
        break;
    }
  }
}
