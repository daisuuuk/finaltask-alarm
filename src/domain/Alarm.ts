
import { type AlarmState, State } from "./AlarmState";
import { AlarmTime } from "./AlarmTime";

/**
 * アラームの状態
 */
export class Alarm {
    constructor(
        private time: AlarmTime,
        private alarmId: string,
        private state: AlarmState = State.ENABLED,
        private selected: boolean = false,
    ) { }

    public toggleOnOff(): void {
        this.state =
            this.state === State.ENABLED
                ? State.DISABLED
                : State.ENABLED;
    }

    /**
     * 有効化処理
     */
    public enable(): void { }
    // { this.state = AlarmState.ENABLED; }

    /**
     * 無効化処理(toggle切り替えver)
     */
    public disable(): void { }
    // { this.state = AlarmState.Disabled;}

    // 汎用化以外での状態管理⇩⇩
    public isActive(): boolean {
        return this.state === State.ENABLED;
    }

    // 状態を「確認する」
    public isRing(): void { }
    // if (this.state === AlarmState.ENABLED) {
    //   this.state = AlarmState.Ringing;
    // }

    // 状態を「変更する」
    public isRinging(): boolean {
        return this.state === State.RINGING;
    }

    // 状態を「確認する」
    public isStop(): void { }
    // { this.state = AlarmState.Disabled;}

    public isStopped(): boolean {
        return this.state === State.DISABLED;
    }

    public isSelected(): boolean {
        return this.selected;
    }

    public toggleSelected(): void {
        this.selected = !this.selected;
    }

    public updateTime(time: AlarmTime): void {
        this.time = time;
    }

    public getTime(): AlarmTime {
        return this.time;
    }

    public getId(): string {
        return this.alarmId;
    }

    public getState(): AlarmState {
        return this.state;
    }

    public static createAlarm(time: AlarmTime): Alarm {
        return new Alarm(
            time,
            crypto.randomUUID(),
            State.ENABLED,
            false,
        );
    }

}