import { ConsumableEffect } from "../models/Item/effects/ConsumableEffect";
import { EquippableEffect } from "../models/Item/effects/EquippableEffect";
import { ItemEffect } from "../models/Item/effects/ItemEffect";
import { ItemData } from "../models/Item/ItemData";

export class ItemEffectController {
  private effects: Map<string, ItemEffect> = new Map();

  public constructor() {}

  public getEffect(itemKey: string, itemData: ItemData): ItemEffect {
    if (this.effects.has(itemKey)) {
      return this.effects.get(itemKey);
    }
    switch (itemData.type) {
      case "Consumable": {
        const effect = new ConsumableEffect(
          itemData.value,
          itemData.consumableType,
        );
        this.effects.set(itemKey, effect);
        return effect;
      }
      case "Equipment": {
        const effect = new EquippableEffect(itemData.statsModifier);
        this.effects.set(itemKey, effect);
        return effect;
      }
    }
  }
}
