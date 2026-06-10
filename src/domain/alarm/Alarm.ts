
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

    /**
     * アラームのtoggleボタンの状態を変更する
     */
    public toggleOnOff(): void {
        this.state =
            this.state === State.ENABLED
                ? State.DISABLED
                : State.ENABLED;
    }

    /**
     * アラームが有効化状態であるということ
     * @returns boolean
     */
    public isActive(): boolean {
        return this.state === State.ENABLED;
    }

    /**
     * アラームが鳴動状態であるということ
     * @returns boolean
     */
    public isRinging(): boolean {
        return this.state === State.RINGING;
    }

    /**
     * アラームの状態を鳴動中に変更する
     */
    public startRinging(): void {
        if (this.state !== State.ENABLED) {
            return
        }

        this.state = State.RINGING;
    }

    /**
     * アラームの状態を無効化状態(停止)に変更する
     */
    public stopRinging(): void {
        if (this.state !== State.RINGING) {
            return
        }

        this.state = State.DISABLED;
    }

    /**
     * アラームが選択されている状態であるということ
     * @returns boolean
     */
    public isSelected(): boolean {
        return this.selected;
    }

    // public toggleSelected(): void {
    //     this.selected = !this.selected;
    // }

    /**
     * アラームの「時間・分」を書き換える
     * @param time 
     */
    public updateTime(time: AlarmTime): void {
        this.time = time;
    }

    /**
     * AlarmTimeクラスの「時間・分」を取得する
     * @returns AlarmTime
     */
    public getTime(): AlarmTime {
        return this.time;
    }

    /**
     * アラームidを取得する
     * @returns string
     */
    public getId(): string {
        return this.alarmId;
    }

    /**
     * アラームの状態を取得する
     * @returns AlarmState
     */
    public getState(): AlarmState {
        return this.state;
    }

    /**
     * AlarmTimeクラスの「時間・分」からアラームを生成する(id・状態・選択状態なども)
     * @param time 
     * @returns Alarm
     */
    public static createAlarm(time: AlarmTime): Alarm {
        return new Alarm(
            time,
            crypto.randomUUID(),
            State.ENABLED,
            false,
        );
    }

}