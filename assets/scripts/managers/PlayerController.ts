import {
  _decorator,
  Component,
  resources,
  Sprite,
  SpriteAtlas,
  tween,
  Tween,
  Vec3,
} from "cc";
import {
  PlayerStats,
  IPlayerStatsModifier as IStatsModifier,
} from "../models/Player/StatsData";
import { IEffectTarget, ItemEffect } from "../models/Item/effects/ItemEffect";
import { EquippableEffect } from "../models/Item/effects/EquippableEffect";
import loadManager from "./LoadManager";
import { EquipmentType } from "../models/Item/ItemData";
const { ccclass, property } = _decorator;

export enum PlayerSignals {
  STATS_MODIFIED = "stats-modified",
}

@ccclass("PlayerController")
export default class PlayerController
  extends Component
  implements IEffectTarget
{
  @property({
    type: Sprite,
    group: "Equipment",
  })
  private helmetSprite: Sprite = null;
  @property({
    type: Sprite,
    group: "Equipment",
  })
  private armourSprite: Sprite = null;
  @property({
    type: Sprite,
    group: "Equipment",
  })
  private bootsSprite: Sprite = null;

  private baseStats: PlayerStats = null;
  private currentStats: PlayerStats = null;
  private equipmentEffects: EquippableEffect[] = [];
  private equippableAtlas: SpriteAtlas = null;
  private spriteComponent: Sprite = null;
  private idleAnimation: Tween = null;

  protected onLoad(): void {
    this.spriteComponent = this.node.getComponent(Sprite);
    const initialStats: IStatsModifier = {
      max_hp: 100,
      max_mp: 100,
      strength: 20,
      agility: 20,
      intelligence: 20,
    };
    this.baseStats = new PlayerStats(initialStats);
    this.currentStats = this.baseStats.clone();
    this.node.emit(PlayerSignals.STATS_MODIFIED, this.currentStats);
    this.loadEquippableAtlas();
    tween(this.node.position)
      .by(
        1.5,
        { y: 15 },
        {
          onUpdate: (target: Vec3) => {
            this.node.setPosition(target);
          },
          easing: "linear",
        },
      )
      .delay(0.2)
      .to(
        1.5,
        { y: 0 },
        {
          onUpdate: (target: Vec3) => {
            this.node.setPosition(target);
          },
          easing: "linear",
        },
      )
      .delay(0.2)
      .union()
      .repeatForever()
      .start();
    loadManager.subscribe("player-base", this.onEquippableLoaded, this);
  }

  public addItem(
    effect: ItemEffect,
    equipment?: {
      image: string;
      equipmentType: EquipmentType;
    },
  ): void {
    effect.apply(this);
    if (!(effect instanceof EquippableEffect)) return;
    this.equipmentEffects.push(effect);
    if (!equipment) return;
    this.displayEquipment(equipment.image, equipment.equipmentType);
  }

  public removeEquipment(
    effect: ItemEffect,
    equipmentType: EquipmentType,
  ): void {
    if (!(effect instanceof EquippableEffect)) return;
    const index = this.equipmentEffects.indexOf(effect);
    if (index === -1) return;
    this.equipmentEffects.splice(index, 1);
    this.reappliedEffects();
    this.clearEquipment(equipmentType);
    this.node.emit(PlayerSignals.STATS_MODIFIED, this.currentStats);
  }

  public addStatsModifier(mod: IStatsModifier): void {
    this.currentStats = this.currentStats.addModifier(mod);
    this.node.emit(PlayerSignals.STATS_MODIFIED, this.currentStats);
  }

  public takeDamage(amount: number): void {
    this.currentStats.current_hp -= amount;
    this.node.emit(PlayerSignals.STATS_MODIFIED, this.currentStats);
  }

  public useMp(amount: number): void {
    this.currentStats.current_mp -= amount;
    this.node.emit(PlayerSignals.STATS_MODIFIED, this.currentStats);
  }

  public healHp(amount: number): void {
    this.currentStats.current_hp += amount;
    this.node.emit(PlayerSignals.STATS_MODIFIED, this.currentStats);
  }

  public healMp(amount: number): void {
    this.currentStats.current_mp += amount;
    this.node.emit(PlayerSignals.STATS_MODIFIED, this.currentStats);
  }

  private reappliedEffects(): void {
    this.currentStats.copy(this.baseStats);
    for (let i = 0; i < this.equipmentEffects.length; i++) {
      this.equipmentEffects[i].apply(this);
    }
  }

  private async loadEquippableAtlas(): Promise<void> {
    const id = loadManager.registerChecker();
    const equippableAtlasPath = "items/equippable_atlas";
    const promise = new Promise((resolve, reject) =>
      resources.load(equippableAtlasPath, SpriteAtlas, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      }),
    );
    await Promise.resolve(promise).then((data: SpriteAtlas) => {
      this.equippableAtlas = data;
      loadManager.completeChecker(id);
    });
  }

  private onEquippableLoaded(): void {
    if (!this.equippableAtlas) return;
    this.spriteComponent.spriteFrame =
      this.equippableAtlas.getSpriteFrame("player-base");
  }

  private displayEquipment(
    imageName: string,
    equipmentType: EquipmentType,
  ): void {
    switch (equipmentType) {
      case "Helmet":
        this.helmetSprite.spriteFrame =
          this.equippableAtlas.getSpriteFrame(imageName);
        break;
      case "Armour":
        this.armourSprite.spriteFrame =
          this.equippableAtlas.getSpriteFrame(imageName);
        break;
      case "Boots":
        this.bootsSprite.spriteFrame =
          this.equippableAtlas.getSpriteFrame(imageName);
        break;
      default:
        break;
    }
  }

  private clearEquipment(equipmentType: EquipmentType): void {
    switch (equipmentType) {
      case "Helmet":
        this.helmetSprite.spriteFrame = null;
        break;
      case "Armour":
        this.armourSprite.spriteFrame = null;
        break;
      case "Boots":
        this.bootsSprite.spriteFrame = null;
        break;
      default:
        break;
    }
  }
}
