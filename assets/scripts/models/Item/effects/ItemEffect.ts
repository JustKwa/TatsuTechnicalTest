import { IPlayerStatsModifier } from "../../Player/StatsData";

export interface IEffectTarget {
  addStatsModifier(mod: IPlayerStatsModifier): void;
  takeDamage(amount: number): void;
  healHp(amount: number): void;
  healMp(amount: number): void;
}

export abstract class ItemEffect {
  public abstract apply(target: IEffectTarget): void;
}
