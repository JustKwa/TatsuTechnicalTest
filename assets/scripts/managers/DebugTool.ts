import { _decorator, Component, Label, Node } from "cc";
const { ccclass, property } = _decorator;

export enum DebugSignals {
  LOSE_HP = "lose-hp",
  LOSE_MP = "lose-mp",
  GET_RANDOM_ITEM = "get-random-item",
}

@ccclass("DebugTool")
export class DebugTool extends Component {
  @property(Label)
  private debugLabel: Label = null;

  private isDebug: boolean = false;

  @property(Node)
  private LoseHpNode: Node = null;

  @property(Node)
  private LoseMpNode: Node = null;

  @property(Node)
  private GetRandomItemNode: Node = null;

  public checkEvent(): void {
    this.isDebug = !this.isDebug;
    this.debugLabel.string = this.isDebug ? "Hide Debug" : "Show Debug";
    if (this.isDebug) {
      this.LoseHpNode.active = true;
      this.LoseMpNode.active = true;
      this.GetRandomItemNode.active = true;
    } else {
      this.LoseHpNode.active = false;
      this.LoseMpNode.active = false;
      this.GetRandomItemNode.active = false;
    }
  }

  public loseHp(): void {
    const amount = 10 + Math.floor(Math.random() * 10);
    this.node.emit(DebugSignals.LOSE_HP, amount);
  }

  public loseMp(): void {
    const amount = 10 + Math.floor(Math.random() * 10);
    this.node.emit(DebugSignals.LOSE_MP, amount);
  }

  public getRandomItem(): void {
    this.node.emit(DebugSignals.GET_RANDOM_ITEM);
  }
}
