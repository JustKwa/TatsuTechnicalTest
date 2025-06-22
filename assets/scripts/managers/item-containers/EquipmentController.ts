import { _decorator } from "cc";
import ItemContainer from "db://assets/scripts/managers/item-containers/ItemContainer";
const { ccclass } = _decorator;

@ccclass("EquipmentController")
export default class EquipmentController extends ItemContainer {
  protected start(): void {
    this.spawnInventorySlot(3);
  }
}
