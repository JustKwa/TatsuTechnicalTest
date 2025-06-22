import { _decorator, resources, JsonAsset } from "cc";
import ItemContainer from "./ItemContainer";
import loadManager from "../LoadManager";
import { IConsumable } from "../../models/Item/ItemData";
import ItemSlotUI from "../../ui/InventorySlotUI";
const { ccclass } = _decorator;

interface IInventoryData {
  items?: string[];
}

@ccclass("InventoryController")
export default class InventoryController extends ItemContainer {
  private inventoryData: IInventoryData = null;

  protected onLoad(): void {
    super.onLoad();
    this.loadInventoryData();
    loadManager.subscribe("inventory-data-loaded", () => {
      console.log(
        (
          ItemContainer.gameController.getItemDataByKey(
            this.itemsList[0],
          ) as IConsumable
        ).value,
      );
      const item = ItemContainer.gameController.getItemDataByKey(
        this.itemsList[1],
      );
      this.node.children[0]
        .getComponent(ItemSlotUI)
        .setItemSprite(item.image, this.itemsList[1]);
      this.node.children[1]
        .getComponent(ItemSlotUI)
        .setItemSprite(item.image, this.itemsList[1]);
    });
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
}
