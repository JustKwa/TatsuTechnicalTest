import { _decorator, Component, Size, Vec3, view } from "cc";
import { ItemData } from "../models/Item/ItemData";
import TooltipPanel, {
  TooltipSignals,
  UseButtonState,
} from "../ui/TooltipPanel";
import { PlayerStats } from "../models/Player/StatsData";
import StatsUI from "../ui/StatsUI";
const { ccclass, property } = _decorator;

export enum HUDSignals {
  ITEM_USED = "item-used",
}

@ccclass("UIController")
export default class UIController extends Component {
  @property(TooltipPanel)
  private tooltipPanel: TooltipPanel = null;
  @property(StatsUI)
  private statsUI: StatsUI = null;

  private bound: Size = null;
  private minVector: Vec3 = null;
  private maxVector: Vec3 = null;

  protected onLoad(): void {
    this.tooltipPanel.node.on(
      TooltipSignals.USE_BUTTON_PRESSED,
      this.onUseButtonPressed,
      this,
    );
    this.bound = view.getVisibleSize();
    this.minVector = new Vec3(210, 0, 0);
    this.maxVector = new Vec3(
      this.bound.width - 210,
      this.bound.height - 10,
      0,
    );
  }

  public showTooltip(
    location: Vec3,
    itemData: ItemData,
    itemKey: string,
    equipment: boolean = false,
  ): void {
    this.tooltipPanel.displayItem(itemData, itemKey, equipment);
    let tooltipLocation = location.clone();
    tooltipLocation = location
      .add3f(
        equipment ? -255 : 0,
        equipment ? -this.tooltipPanel.getHeight() / 2 : 55,
        0,
      )
      .clampf(
        this.minVector,
        new Vec3(
          this.maxVector.x,
          this.maxVector.y - this.tooltipPanel.getHeight(),
        ),
      );
    this.tooltipPanel.setWorldPosition(tooltipLocation);
  }

  private onUseButtonPressed(itemKey: string, useState: UseButtonState): void {
    this.node.emit(HUDSignals.ITEM_USED, itemKey, useState);
  }

  public updateStats(stats: PlayerStats): void {
    this.statsUI.updateStats(stats);
  }
}
