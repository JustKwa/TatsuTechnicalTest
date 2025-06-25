import { _decorator, Toggle, Component, Sprite, SpriteAtlas } from "cc";
import loadManager from "../managers/LoadManager";
const { ccclass, property } = _decorator;

export enum SlotSignals {
  SELECTED = "selected",
}

@ccclass("ItemSlotUI")
export default class ItemSlotUI extends Component {
  @property(Sprite)
  private itemSprite: Sprite = null;
  private spriteComponent: Sprite = null;
  private buttonComponent: Toggle = null;

  private static atlas: SpriteAtlas = null;
  private static uid: number = 0;

  private isSelected: boolean = false;

  public currentItemKey: string = "";

  public static inject(atlas: SpriteAtlas) {
    ItemSlotUI.atlas = atlas;
  }

  protected onLoad(): void {
    this.spriteComponent = this.node.getComponent(Sprite);
    this.buttonComponent = this.node.getComponent(Toggle);
    loadManager.subscribe(
      `ui-slot-${ItemSlotUI.uid++}`,
      () => {
        if (!ItemSlotUI.atlas) return;
        this.spriteComponent.spriteFrame =
          ItemSlotUI.atlas.getSpriteFrame("ui-border");
      },
      this,
    );
  }

  public setItemSprite(imageName: string, itemKey: string): void {
    this.itemSprite.spriteFrame = ItemSlotUI.atlas.getSpriteFrame(imageName);
    this.currentItemKey = itemKey;
    this.buttonComponent.enabled = true;
    this.buttonComponent.interactable = true;
  }

  // Used by Button
  public onTapped(): void {
    this.isSelected = !this.isSelected;
    const location = this.node.getWorldPosition();
    this.node.emit(SlotSignals.SELECTED, this.currentItemKey, location);
  }

  public clear(): void {
    this.itemSprite.spriteFrame = null;
    this.buttonComponent.enabled = false;
    this.buttonComponent.interactable = false;
  }

  public isBeingUsed(): boolean {
    return this.buttonComponent.interactable;
  }
}
