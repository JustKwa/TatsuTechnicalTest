import {
  _decorator,
  Component,
  JsonAsset,
  Prefab,
  resources,
  SpriteAtlas,
} from "cc";
import InventoryController from "db://assets/scripts/managers/item-containers/InventoryController";
import EquipmentController from "./item-containers/EquipmentController";
import ItemContainer from "./item-containers/ItemContainer";
import { IItemJson, ItemData } from "db://assets/scripts/models/Item/ItemData";
import loadManager from "./LoadManager";
import ItemSlotUI from "../ui/InventorySlotUI";
const { ccclass, property, executionOrder } = _decorator;

@ccclass("GameController")
@executionOrder(0)
export default class GameController extends Component {
  @property({
    type: Prefab,
    group: "ItemContainer",
  })
  private uiSlotPrefab: Prefab = null;
  @property({
    type: InventoryController,
    group: "ItemContainer",
  })
  private inventoryController: InventoryController = null;
  @property({
    type: EquipmentController,
    group: "ItemContainer",
  })
  private equipmentController: InventoryController = null;

  private itemsData: IItemJson = null;
  private itemsAtlas: SpriteAtlas = null;

  protected onLoad(): void {
    ItemContainer.inject(this, this.uiSlotPrefab);
    this.loadItemsData();
    this.loadItemsAtlas();
  }

  private async loadItemsData(): Promise<void> {
    const id = loadManager.registerChecker();
    const itemsDataPath = "items/items_data";
    const promise = new Promise((resolve, reject) =>
      resources.load(itemsDataPath, JsonAsset, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      }),
    );
    await Promise.resolve(promise).then((data: JsonAsset) => {
      this.itemsData = data.json;
      loadManager.completeChecker(id);
    });
  }

  private async loadItemsAtlas(): Promise<void> {
    const id = loadManager.registerChecker();
    const itemsAtlasPath = "items/items_atlas";
    const promise = new Promise((resolve, reject) =>
      resources.load(itemsAtlasPath, SpriteAtlas, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      }),
    );
    await Promise.resolve(promise).then((data: SpriteAtlas) => {
      this.itemsAtlas = data;
      ItemSlotUI.inject(data);
      loadManager.completeChecker(id);
    });
  }

  public getItemDataByKey(itemKey: string): ItemData {
    return this.itemsData.items[itemKey];
  }
}
