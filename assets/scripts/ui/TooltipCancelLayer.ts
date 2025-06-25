import { _decorator, Component, Node } from "cc";
import TooltipPanel from "./TooltipPanel";
const { ccclass, property } = _decorator;

@ccclass("TooltipCancelLayer")
export default class TooltipCancelLayer extends Component {
  @property(TooltipPanel)
  private tooltipPanel: TooltipPanel = null;

  protected onLoad(): void {
    this.node.on(Node.EventType.TOUCH_END, this.hideTooltip, this);
  }

  public hideTooltip(): void {
    this.tooltipPanel.hideTooltip();
  }
}
