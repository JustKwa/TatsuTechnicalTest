import {
  _decorator,
  Component,
  instantiate,
  Layout,
  Prefab,
  Node,
  Vec3,
} from "cc";
import ItemSlotUI, { SlotSignals } from "../../ui/InventorySlotUI";
import loadManager from "../LoadManager";
import { ItemData } from "../../models/Item/ItemData";
const { ccclass, requireComponent } = _decorator;

@ccclass("ItemContainer")
@requireComponent(Layout)
export default abstract class ItemContainer extends Component {
  protected static inventorySlotPrefab: Prefab = null;
  protected static getItemDataByKey: (key: string) => ItemData = null;
  protected layoutComponent: Layout | null = null;
  protected itemsList: string[] = [];
  protected numberDisplayItems: number = 0;

  public static inject(
    getItemDataByKey: (key: string) => ItemData,
    inventorySlotPrefab: Prefab,
  ) {
    ItemContainer.getItemDataByKey = getItemDataByKey;
    ItemContainer.inventorySlotPrefab = inventorySlotPrefab;
  }

  protected onLoad(): void {
    this.layoutComponent = this.node.getComponent(Layout);
    loadManager.subscribe("item-container", this.onDataFinishedLoading, this);
  }

  protected spawnInventorySlot(amount: number = 10): void {
    for (let i = 0; i < amount; i++) {
      const inventorySlot: Node = instantiate(
        ItemContainer.inventorySlotPrefab,
      );
      inventorySlot.on(SlotSignals.SELECTED, this.onSlotSelected, this);
      this.node.addChild(inventorySlot);
    }
  }

  protected abstract onSlotSelected(itemKey: string, location: Vec3): void;

  public removeItem(itemKey: string): void {
    const slotIndex = this.itemsList.indexOf(itemKey);
    if (slotIndex === -1) return;
    this.numberDisplayItems--;
    const childNode = this.node.children[slotIndex];
    childNode.getComponent(ItemSlotUI).clear();
    childNode.setSiblingIndex(this.itemsList.length);
    this.itemsList.splice(slotIndex, 1);
  }

  public addItem(itemKey: string): void {
    this.itemsList.push(itemKey);
    const childIndex = this.itemsList.length - 1;
    const imageName = ItemContainer.getItemDataByKey(itemKey).image;
    this.displayItem(childIndex, imageName, itemKey);
  }

  protected onDataFinishedLoading(): void {
    if (!this.itemsList) return;
    for (let i = 0; i < this.itemsList.length; i++) {
      const item = ItemContainer.getItemDataByKey(this.itemsList[i]);
      this.displayItem(i, item.image, this.itemsList[i]);
    }
  }

  protected displayItem(
    index: number,
    imageName: string,
    itemKey: string,
  ): void {
    this.numberDisplayItems++;
    this.node.children[index]
      .getComponent(ItemSlotUI)
      .setItemSprite(imageName, itemKey);
  }

  public isFull(): boolean {
    return this.numberDisplayItems === this.node.children.length;
  }
}
