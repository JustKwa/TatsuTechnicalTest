import { IPlayerStatsModifier } from "../../Player/StatsData";
import { IEffectTarget, ItemEffect } from "./ItemEffect";

export class EquippableEffect extends ItemEffect {
  constructor(private mod: IPlayerStatsModifier) {
    super();
  }
  public apply(target: IEffectTarget): void {
    target.addStatsModifier(this.mod);
  }
}
