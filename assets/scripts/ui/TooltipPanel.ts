import { _decorator, Component, Label, UITransform, Vec3 } from "cc";
import { IConsumable, IEquipable, ItemData } from "../models/Item/ItemData";
const { ccclass, property } = _decorator;

export enum TooltipSignals {
  USE_BUTTON_PRESSED = "use-button-pressed",
}

export const UseButtonTexts = ["EQUIP", "UNEQUIP", "USE"] as const;
export type UseButtonState = (typeof UseButtonTexts)[number];

@ccclass("TooltipPanel")
export default class TooltipPanel extends Component {
  @property(Label)
  private titleLabel: Label = null;
  @property(Label)
  private descriptionLabel: Label = null;
  @property(Label)
  private statsLabel: Label = null;
  @property(Label)
  private useLabel: Label = null;

  private currentItemKey: string = "";

  protected start(): void {
    this.node.active = false;
  }

  public displayItem(
    item: ItemData,
    itemKey: string,
    isEquipped: boolean,
  ): void {
    this.node.active = true;
    this.currentItemKey = itemKey;
    switch (item.type) {
      case "Consumable":
        this.displayConsumable(item);
        break;
      case "Equipment":
        this.displayEquipment(item, isEquipped);
        break;
    }
  }

  public hideTooltip(): void {
    this.titleLabel.string = "";
    this.descriptionLabel.string = "";
    this.statsLabel.string = "";
    this.node.active = false;
  }

  private formatDescription(
    template: string,
    data: { [key: string]: any },
  ): string {
    return template.replace(/{(\w+)}/g, (_, key) =>
      data[key] != null ? String(data[key]) : `{${key}}`,
    );
  }

  private displayConsumable(consumable: IConsumable): void {
    const labelText: UseButtonState = "USE";
    this.useLabel.string = labelText;
    this.titleLabel.string = consumable.name;
    this.descriptionLabel.string = this.formatDescription(
      consumable.description,
      {
        value: consumable.value,
      },
    );
  }

  private displayEquipment(equipment: IEquipable, isEquipped: boolean): void {
    const labelText: UseButtonState = isEquipped ? "UNEQUIP" : "EQUIP";
    this.useLabel.string = labelText;
    this.titleLabel.string = equipment.name;
    const stats = equipment.statsModifier;
    const hp = stats.max_hp ? this.getStatsRow("HP", stats.max_hp) : "";
    const mp = stats.max_mp ? this.getStatsRow("MP", stats.max_mp) : "";
    const str = stats.strength ? this.getStatsRow("STR", stats.strength) : "";
    const agi = stats.agility ? this.getStatsRow("AGI", stats.agility) : "";
    const int = stats.intelligence
      ? this.getStatsRow("INT", stats.intelligence)
      : "";
    this.descriptionLabel.string = equipment.description;
    this.statsLabel.string = `${hp}${mp}${str}${agi}${int}`;
  }

  public onUseButtonPressed(): void {
    this.node.emit(
      TooltipSignals.USE_BUTTON_PRESSED,
      this.currentItemKey,
      this.useLabel.string,
    );
    this.hideTooltip();
  }

  public getHeight(): number {
    return this.node.getComponent(UITransform).height;
  }

  private getStatsRow(stats: string, value: number): string {
    return `\n${stats}: ${value}`;
  }

  public setWorldPosition(position: Vec3): void {
    this.node.setWorldPosition(position);
  }
}
