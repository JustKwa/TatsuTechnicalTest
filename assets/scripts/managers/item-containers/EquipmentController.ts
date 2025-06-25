import { _decorator, math } from "cc";
import ItemContainer from "db://assets/scripts/managers/item-containers/ItemContainer";
import ItemSlotUI from "../../ui/InventorySlotUI";
import { EquipmentType } from "../../models/Item/ItemData";
const { ccclass } = _decorator;

export enum EquipmentSignals {
  SELECTED = "selected",
}

@ccclass("EquipmentController")
export default class EquipmentController extends ItemContainer {
  protected start(): void {
    this.spawnInventorySlot(3);
  }

  public override addItem(itemKey: string): void {
    const itemData = ItemContainer.getItemDataByKey(itemKey);
    if (itemData.type !== "Equipment") return;
    this.itemsList.push(itemKey);
    const childIndex: number = this.getIndexByEquipmentType(
      itemData.equipmentType,
    );
    if (childIndex === -1) return;
    const imageName = itemData.image;
    this.displayItem(childIndex, imageName, itemKey);
  }

  public override removeItem(itemKey: string): void {
    const itemData = ItemContainer.getItemDataByKey(itemKey);
    if (itemData.type !== "Equipment") return;
    const slotIndex = this.getIndexByEquipmentType(itemData.equipmentType);
    if (slotIndex === -1) return;
    this.numberDisplayItems--;
    this.itemsList.splice(slotIndex, 1);
    const childNode = this.node.children[slotIndex];
    childNode.getComponent(ItemSlotUI).clear();
  }

  protected onSlotSelected(itemKey: string, location: math.Vec3): void {
    this.node.emit(EquipmentSignals.SELECTED, itemKey, location);
  }

  private getIndexByEquipmentType(equipmentType: EquipmentType): number {
    switch (equipmentType) {
      case "Helmet":
        return 0;
      case "Armour":
        return 1;
      case "Boots":
        return 2;
      default:
        return -1;
    }
  }

  public isSlotTaken(type: EquipmentType): boolean {
    const slotIndex = this.getIndexByEquipmentType(type);
    return this.node.children[slotIndex].getComponent(ItemSlotUI).isBeingUsed();
  }
}
