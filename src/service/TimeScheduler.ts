
import { Alarm } from "../domain/Alarm";

/**
 * アラーム時刻の監視をするクラス
 */
export class TimeScheduler {
    // 内部状態を保持するメンバー変数
    private alarm!: Alarm;
    private timerId: number | null = null;
    // アラームIDごとにタイマーを管理する箱
    // private scheduler: schedulerMap<string, number>;
    // 鳴動条件も
    // + monitorAlarmTime(alarm: Alarm): void

    public startMonitoring(alarm: Alarm, callback: (alarm: Alarm) => void): void {
        // {
        // toggleボタンがONになると、設定時刻までの時刻を計算開始するメソッド
        // setTimeoutなど
        // }
    }
    
    public stopMonitoring(alarm: Alarm): void {
        // toggleボタンがOFFになると、計算停止するメソッド
        // 鳴動開始時刻になると、計算停止するメソッド
        // clearTimeoutなど
        // }
    }
}