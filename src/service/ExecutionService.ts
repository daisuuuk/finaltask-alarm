
import { TimeScheduler } from "./TimeScheduler";
import { SoundPlayer } from "../infra/SoundPlayer";
import { AlarmTime } from "../domain/AlarmTime";

export class ExecutionService {
    constructor(
        private scheduler: TimeScheduler,
        private sound: SoundPlayer,
    ) {}

    /**
     * 時間到達のコールバック処理をセット
     * @param listener 
     */
    private setListener(listener: () => void) {
        // this.onTimeReached = listener;
    }

    /**
     * コールバックを処理する
     */
    private handleTimeReached(): void {
        // this.onTimeReached;
    }

    public stopAlarm(): void {
        // this.sound.stopSound();
    }

    public startSchedule(): void { }
    public stopSchedule(): void { }

    /**
     * 音の再生・停止指示
     */
    public startAlarm(now: AlarmTime): void {
        // ⬇️鳴ったアラームある？
        // const events = this.alarmList.changeState(now);
        // ⬇全てのアラームをループで確認
        // for (const event of events) {
        //     this.handle(event);
        //   }
        // }
        // ⬇1件でもあれば音鳴らす的な
        // private handle(event: AlarmRangEvent): void {
        //  this.soundPlayer.play();
        // }
    }

}