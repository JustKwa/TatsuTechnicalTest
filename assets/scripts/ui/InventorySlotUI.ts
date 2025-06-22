import { _decorator, Button, Component, Sprite, SpriteAtlas, Color } from "cc";
import loadManager from "../managers/LoadManager";
const { ccclass, property } = _decorator;

export enum SlotSignals {
  SELECTED = "selected",
  UNSELECTED = "unselected",
}

const SpriteColor = {
  NORMAL: "FFFFFF",
  SELECTED: "FFFFFFA2",
};

@ccclass("ItemSlotUI")
export default class ItemSlotUI extends Component {
  @property(Sprite)
  private itemSprite: Sprite = null;
  private spriteComponent: Sprite = null;
  private buttonComponent: Button = null;

  private static atlas: SpriteAtlas = null;
  private static uid: number = 0;

  private isSelected: boolean = false;

  public currentItemKey: string = "";

  public static inject(atlas: SpriteAtlas) {
    ItemSlotUI.atlas = atlas;
  }

  protected onLoad(): void {
    this.spriteComponent = this.node.getComponent(Sprite);
    this.buttonComponent = this.node.getComponent(Button);
    loadManager.subscribe(`ui-slot-${ItemSlotUI.uid++}`, () => {
      if (!ItemSlotUI.atlas) return;
      this.spriteComponent.spriteFrame =
        ItemSlotUI.atlas.getSpriteFrame("ui-border");
    });
  }

  public setItemSprite(imageName: string, itemKey: string): void {
    this.itemSprite.spriteFrame = ItemSlotUI.atlas.getSpriteFrame(imageName);
    this.currentItemKey = itemKey;
    this.buttonComponent.interactable = true;
  }

  // Used by Button
  public onTapped(): void {
    this.isSelected = !this.isSelected;
    if (!this.isSelected) {
      this.spriteComponent.color.set(new Color(SpriteColor.SELECTED));
      this.node.emit(SlotSignals.SELECTED, this.currentItemKey);
    } else {
      this.spriteComponent.color.set(new Color(SpriteColor.NORMAL));
      this.node.emit(SlotSignals.UNSELECTED, this.currentItemKey);
    }
  }
}
