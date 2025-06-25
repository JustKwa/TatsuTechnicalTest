import { _decorator, resources, JsonAsset, Vec3 } from "cc";
import ItemContainer from "./ItemContainer";
import loadManager from "../LoadManager";
import ItemSlotUI from "../../ui/InventorySlotUI";
const { ccclass } = _decorator;

export enum InventorySignals {
  SELECTED = "selected",
}

interface IInventoryData {
  items?: string[];
}

@ccclass("InventoryController")
export default class InventoryController extends ItemContainer {
  protected onLoad(): void {
    super.onLoad();
    this.loadInventoryData();
  }

  protected start(): void {
    this.spawnInventorySlot(20);
  }

  private async loadInventoryData(): Promise<void> {
    const id = loadManager.registerChecker();
    const inventoryDataPath = "items/inventory_data";
    const promise = new Promise((resolve, reject) =>
      resources.load(inventoryDataPath, JsonAsset, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      }),
    );
    await Promise.resolve(promise).then((data: JsonAsset) => {
      const itemsJson: IInventoryData = data.json;
      if (!itemsJson.items) return;
      itemsJson.items.forEach((itemKey: string) => {
        this.itemsList.push(itemKey);
      });
      loadManager.completeChecker(id);
    });
  }

  protected onSlotSelected(itemKey: string, location: Vec3): void {
    this.node.emit(InventorySignals.SELECTED, itemKey, location);
  }
}
