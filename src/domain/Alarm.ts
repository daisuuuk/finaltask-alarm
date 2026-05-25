
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

    // 汎用化以外での状態管理⇩⇩
    public isActive(): boolean {
        return this.state === State.ENABLED;
    }

    // 鳴動開始
    public startRinging(): void {
        if (this.state !== State.ENABLED) {
            return
        }

        this.state = State.RINGING;
    }

    // 鳴動停止
    public stopRinging(): void {
        if (this.state !== State.RINGING) {
            return
        }

        this.state = State.DISABLED;
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