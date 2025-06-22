import {
  _decorator,
  assert,
  Component,
  instantiate,
  Layout,
  Prefab,
  Node,
} from "cc";
import GameController from "../GameController";
import { SlotSignals } from "../../ui/InventorySlotUI";
const { ccclass, requireComponent } = _decorator;

@ccclass("ItemContainer")
@requireComponent(Layout)
export default class ItemContainer extends Component {
  protected static inventorySlotPrefab: Prefab = null;
  protected static gameController: GameController = null;
  protected layoutComponent: Layout | null = null;
  protected itemsList: string[] = [];

  public static inject(
    gameController: GameController,
    inventorySlotPrefab: Prefab,
  ) {
    ItemContainer.gameController = gameController;
    ItemContainer.inventorySlotPrefab = inventorySlotPrefab;
  }

  protected onLoad(): void {
    assert(
      ItemContainer.inventorySlotPrefab != null,
      "InventoryController: inventorySlotPrefab is null",
    );
    this.layoutComponent = this.node.getComponent(Layout);
  }

  protected spawnInventorySlot(amount: number = 10): void {
    for (let i = 0; i < amount; i++) {
      const inventorySlot: Node = instantiate(
        ItemContainer.inventorySlotPrefab,
      );
      inventorySlot.on(SlotSignals.SELECTED, this.onSlotSelected, this);
      inventorySlot.on(SlotSignals.UNSELECTED, this.onSlotUnselected, this);
      this.node.addChild(inventorySlot);
    }
  }

  protected onSlotSelected(itemKey: string): void {
    console.log(ItemContainer.gameController.getItemDataByKey(itemKey));
  }

  protected onSlotUnselected(itemKey: string): void {
    console.log(itemKey);
  }
}
