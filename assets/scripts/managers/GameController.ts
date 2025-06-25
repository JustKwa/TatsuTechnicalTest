import {
  _decorator,
  Component,
  JsonAsset,
  log,
  Prefab,
  resources,
  SpriteAtlas,
  tween,
  Vec3,
  Node,
  UIOpacity,
} from "cc";
import InventoryController, {
  InventorySignals,
} from "db://assets/scripts/managers/item-containers/InventoryController";
import EquipmentController, {
  EquipmentSignals,
} from "./item-containers/EquipmentController";
import ItemContainer from "./item-containers/ItemContainer";
import { IItemJson, ItemData } from "db://assets/scripts/models/Item/ItemData";
import loadManager from "./LoadManager";
import ItemSlotUI from "../ui/InventorySlotUI";
import UIController, { HUDSignals } from "./UIController";
import PlayerController, { PlayerSignals } from "./PlayerController";
import { ItemEffectController } from "./ItemEffectController";
import { UseButtonState } from "../ui/TooltipPanel";
import { PlayerStats } from "../models/Player/StatsData";
import { DebugSignals, DebugTool } from "./DebugTool";
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
  private equipmentController: EquipmentController = null;
  @property({
    type: PlayerController,
    group: "PlayerController",
  })
  private playerController: PlayerController = null;
  @property({
    type: DebugTool,
    group: "DebugTool",
  })
  private debugTool: DebugTool = null;

  @property({
    type: Node,
    group: "Intro Animation",
  })
  private cameraNode: Node = null;
  @property({
    type: UIOpacity,
    group: "Intro Animation",
  })
  private topViewOpacity: UIOpacity = null;
  @property({
    type: UIOpacity,
    group: "Intro Animation",
  })
  private bottomViewOpacity: UIOpacity = null;
  @property({
    type: UIOpacity,
    group: "Intro Animation",
  })
  private debugViewOpacity: UIOpacity = null;

  private hudController: UIController = null;
  private itemEffectController: ItemEffectController =
    new ItemEffectController();
  private itemsData: IItemJson = null;

  protected onLoad(): void {
    this.hudController = this.node.getComponent(UIController);
    this.hudController.node.on(HUDSignals.ITEM_USED, this.onItemUsed, this);

    ItemContainer.inject(this.getItemDataByKey.bind(this), this.uiSlotPrefab);

    this.inventoryController.node.on(
      InventorySignals.SELECTED,
      this.onItemSelected,
      this,
    );

    this.equipmentController.node.on(
      EquipmentSignals.SELECTED,
      this.onEquipmentSelected,
      this,
    );

    this.playerController.node.on(
      PlayerSignals.STATS_MODIFIED,
      this.onPlayerStatsModified,
      this,
    );

    this.debugTool.node.on(DebugSignals.LOSE_HP, this.onLoseHp, this);
    this.debugTool.node.on(DebugSignals.LOSE_MP, this.onLoseMp, this);
    this.debugTool.node.on(
      DebugSignals.GET_RANDOM_ITEM,
      this.onGetRandomItem,
      this,
    );
    loadManager.subscribe(
      "intro-animation",
      () => {
        tween(this.cameraNode.position)
          .delay(0.2)
          .by(
            1.0,
            { y: 0 },
            {
              onStart: () => {
                this.cameraNode.setPosition(0, -10);
              },
              onUpdate: (target: Vec3, ratio: number) => {
                this.cameraNode.setPosition(target);
                this.topViewOpacity.opacity = ratio * 255;
                this.bottomViewOpacity.opacity = ratio * 255;
                this.debugViewOpacity.opacity = ratio * 255;
              },
              easing: "sineIn",
            },
          )
          .start();
      },
      this,
    );
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
      ItemSlotUI.inject(data);
      loadManager.completeChecker(id);
    });
  }

  public getItemDataByKey(itemKey: string): ItemData {
    return this.itemsData.items[itemKey];
  }

  private onItemSelected(itemKey: string, location: Vec3): void {
    this.hudController.showTooltip(
      location,
      this.getItemDataByKey(itemKey),
      itemKey,
    );
  }

  private onItemUsed(itemKey: string, useState: UseButtonState): void {
    const itemData = this.getItemDataByKey(itemKey);
    if (!itemData) return;
    if (useState === "UNEQUIP") {
      this.onEquipmentUnequipped(itemKey);
      return;
    }
    const effect = this.itemEffectController.getEffect(itemKey, itemData);
    switch (itemData.type) {
      case "Consumable": {
        this.inventoryController.removeItem(itemKey);
        this.playerController.addItem(effect);
        break;
      }
      case "Equipment": {
        if (this.equipmentController.isFull()) return;
        if (this.equipmentController.isSlotTaken(itemData.equipmentType))
          return;
        this.inventoryController.removeItem(itemKey);
        this.equipmentController.addItem(itemKey);
        this.playerController.addItem(effect, {
          image: itemData.image,
          equipmentType: itemData.equipmentType,
        });
        break;
      }
      default:
        break;
    }
  }

  private onEquipmentSelected(itemKey: string, location: Vec3): void {
    this.hudController.showTooltip(
      location,
      this.getItemDataByKey(itemKey),
      itemKey,
      true,
    );
  }

  private onEquipmentUnequipped(itemKey: string): void {
    this.inventoryController.addItem(itemKey);
    this.equipmentController.removeItem(itemKey);
    const itemData = this.getItemDataByKey(itemKey);
    const effect = this.itemEffectController.getEffect(itemKey, itemData);
    if (itemData.type !== "Equipment") return;
    this.playerController.removeEquipment(effect, itemData.equipmentType);
  }

  private onPlayerStatsModified(stats: PlayerStats): void {
    this.hudController.updateStats(stats);
  }

  private onLoseHp(amount: number): void {
    this.playerController.takeDamage(amount);
  }

  private onLoseMp(amount: number): void {
    this.playerController.useMp(amount);
  }

  private onGetRandomItem(): void {
    // TODO: find a better way to get random items
    const availableItems = ["potion-hp", "potion-mp"];
    const randomItem =
      availableItems[Math.floor(Math.random() * availableItems.length)];
    this.inventoryController.addItem(randomItem);
  }
}
