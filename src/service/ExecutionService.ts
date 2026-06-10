
import { TimeScheduler } from "./TimeScheduler";
import { type ISoundPlayer } from "../common/ISoundPlayer";
import type { Alarm } from "../domain/alarm/Alarm";
import { type IExecutionService } from "../controller/AlarmDisplayController";

export type TimeReachedListener = (alarm: Alarm) => void;

export class ExecutionService implements IExecutionService {
    // 外部（UIなど）にイベントを伝える仕組み
    // 「通知するだけ」で誰が受け取るか知らない
    private listener?: TimeReachedListener;
    // 今鳴っているアラーム
    // 鳴動の全体ルール（同時鳴動1つ）
    private currentRinging: Alarm | null = null;

    constructor(
        private scheduler: TimeScheduler,
        private sound: ISoundPlayer,
    ) { }

    /**
     * 時間到達のコールバック処理をセット
     * @param listener 
     */
    public timeReached(listener: TimeReachedListener): void {
        this.listener = listener;
    }

    /**
     * コールバックを処理する
     */
    // コールバックの流れザックリ ⑦listener呼び出し + 音を鳴らす
    private handleTimeReached(alarm: Alarm): void {
        console.log("handleTimeReached 呼ばれた！", alarm.getId());
        // this.onTimeReached;

        // 今鳴っているアラームを上書きする
        if (this.currentRinging) {
            // 今鳴っているアラームを State.DISABLEDにする
            this.currentRinging.stopRinging();
            this.sound.stopSound();
        }

        alarm.startRinging();
        // OFFのアラームは省くために必要
        if (!alarm.isRinging()) {
            return;
        }

        this.currentRinging = alarm;
        this.sound.startSound();
        // listener が登録されていれば呼ぶ
        // コールバック関数(=listener)が未登録でも安全に動く設計
        // UI側でlistener登録しているので仕様通りではある
        console.log("listener:", this.listener);
        if (this.listener !== undefined) {
            this.listener(alarm);
        }
    }

    // コールバックの流れザックリ ③スケジューラーの監視開始メソッドを処理
    // コールバックの流れザックリ ⑥時間到達処理(handleTimeReached)
    public startAlarmMonitoring(alarm: Alarm): void {
        if (!alarm.isActive()) {
            return;
        }

        this.scheduler.startMonitoring(alarm, (a) => {
            this.handleTimeReached(a);
        });
    }

    public stopAlarmMonitoring(id: string): void {
        this.scheduler.stopMonitoring(id);

        // もし鳴っているアラームなら止める
        if (this.currentRinging?.getId() === id) {
            this.stopAlarm();
        }
    }

    // 今鳴っているアラームだけ止める処理
    public stopAlarm(): void {
        if(!this.currentRinging) {
            return;
        }

        this.sound.stopSound();
        this.currentRinging.stopRinging();
        this.currentRinging = null;
    }

    // 予約済み全タイマー + 今鳴っているもの を全部止める処理
    public stopAllAlarm(): void {
        // 全タイマーキャンセルし、
        this.scheduler.stopAll();
        // 今鳴っているものも止める
        this.stopAlarm();
    }

}