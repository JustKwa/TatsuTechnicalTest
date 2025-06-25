import { _decorator, Component, Label, ProgressBar } from "cc";
import { PlayerStats } from "../models/Player/StatsData";
const { ccclass, property } = _decorator;

@ccclass("StatsUI")
export default class StatsUI extends Component {
  @property(Label)
  private strLabel: Label = null;
  @property(Label)
  private agiLabel: Label = null;
  @property(Label)
  private intLabel: Label = null;
  @property(ProgressBar)
  private hpProgressBar: ProgressBar = null;
  @property(Label)
  private hpLabel: Label = null;
  @property(ProgressBar)
  private mpProgressBar: ProgressBar = null;
  @property(Label)
  private mpLabel: Label = null;

  public updateStats(stats: PlayerStats): void {
    this.strLabel.string = `${stats.strength}`;
    this.agiLabel.string = `${stats.agility}`;
    this.intLabel.string = `${stats.intelligence}`;
    this.hpProgressBar.progress = stats.current_hp / stats.max_hp;
    this.hpLabel.string = `${stats.current_hp}/${stats.max_hp}`;
    this.mpProgressBar.progress = stats.current_mp / stats.max_mp;
    this.mpLabel.string = `${stats.current_mp}/${stats.max_mp}`;
  }
}
