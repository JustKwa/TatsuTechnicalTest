const ItemTypes = ["Equipment", "Consumable"] as const;
export type ItemType = (typeof ItemTypes)[number];

const EquipmentTypes = ["Helmet", "Armour", "Boots"] as const;
export type EquipmentType = (typeof EquipmentTypes)[number];

const ConsumableTypes = ["HP Potion", "MP Potion"] as const;
export type ConsumableType = (typeof ConsumableTypes)[number];

export interface IItemBase {
  name: string;
  description: string;
  image: string;
  type: ItemType;
}

export interface IEquipable extends IItemBase {
  type: "Equipment";
  equipmentType: EquipmentType;
}

export interface IConsumable extends IItemBase {
  type: "Consumable";
  consumableType: ConsumableType;
  value: number;
}

export type ItemData = IEquipable | IConsumable;

interface IItems {
  [key: string]: ItemData;
}

export interface IItemJson {
  items?: IItems;
}
