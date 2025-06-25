export interface IPlayerStatsModifier {
  max_hp?: number;
  max_mp?: number;
  strength?: number;
  agility?: number;
  intelligence?: number;
}

export class PlayerStats {
  public max_hp: number;
  private _current_hp: number;
  public get current_hp(): number {
    return this._current_hp;
  }
  public set current_hp(value: number) {
    this._current_hp = value;
    if (this._current_hp > this.max_hp) {
      this._current_hp = this.max_hp;
    }
  }
  public max_mp: number;
  private _current_mp: number;
  public get current_mp(): number {
    return this._current_mp;
  }
  public set current_mp(value: number) {
    this._current_mp = value;
    if (this._current_mp > this.max_mp) {
      this._current_mp = this.max_mp;
    }
  }
  public strength: number;
  public agility: number;
  public intelligence: number;

  public constructor(
    stats: IPlayerStatsModifier = {
      max_hp: 0,
      max_mp: 0,
      strength: 0,
      agility: 0,
      intelligence: 0,
    },
  ) {
    this.max_hp = stats.max_hp || 0;
    this.max_mp = stats.max_mp || 0;
    this.strength = stats.strength || 0;
    this.agility = stats.agility || 0;
    this.intelligence = stats.intelligence || 0;
    this.current_hp = this.max_hp;
    this.current_mp = this.max_mp;
  }

  public clone(): PlayerStats {
    return new PlayerStats(this);
  }

  public addModifier(modifier: IPlayerStatsModifier): PlayerStats {
    this.max_hp += modifier.max_hp || 0;
    this.max_mp += modifier.max_mp || 0;
    this.strength += modifier.strength || 0;
    this.agility += modifier.agility || 0;
    this.intelligence += modifier.intelligence || 0;
    return this;
  }

  public addModifiers(modifiers: IPlayerStatsModifier[]): PlayerStats {
    for (let i = 0; i < modifiers.length; i++) {
      this.addModifier(modifiers[i]);
    }
    return this;
  }

  public removeModifier(
    modifier: IPlayerStatsModifier,
    out: PlayerStats,
  ): PlayerStats {
    out.max_hp = this.max_hp - modifier.max_hp || 0;
    out.max_mp = this.max_mp - modifier.max_mp || 0;
    out.strength = this.strength - modifier.strength || 0;
    out.agility = this.agility - modifier.agility || 0;
    out.intelligence = this.intelligence - modifier.intelligence || 0;
    return out;
  }

  public toString(): string {
    return `HP: ${this.current_hp}/${this.max_hp} MP: ${this.current_mp}/${this.max_mp} STR: ${this.strength} AGI: ${this.agility} INT: ${this.intelligence}`;
  }

  public copy(stats: PlayerStats): void {
    this.max_hp = stats.max_hp;
    this.max_mp = stats.max_mp;
    this.strength = stats.strength;
    this.agility = stats.agility;
    this.intelligence = stats.intelligence;
    this.current_hp = stats.current_hp;
    this.current_mp = stats.current_mp;
  }
}
