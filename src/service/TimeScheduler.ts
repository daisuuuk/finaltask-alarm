
import { Alarm } from "../domain/Alarm";

type CallBackMold = (alarm: Alarm) => void

/**
 * アラーム時刻の監視をするクラス
 */
export class TimeScheduler {
    // アラームIDごとにタイマーを管理する箱
    // Mapで複数アラーム管理
    private alarms: Map<string, number> = new Map();

    // コールバックの流れザックリ ④setTimeOut
    // コールバックの流れザックリ ⑤時間到達でコールバック
    public startMonitoring(alarm: Alarm, callback: CallBackMold): void {
        // Mapでアラームを複数管理している為、どのタイマーを操作するか識別するため(Map管理の前提条件)
        const id = alarm.getId();

        // 重複防止（既存タイマーがあれば先に消す）
        this.stopMonitoring(id);

        // ①アラームの時間・分を取得し = alarm.getTime()
        // ②現在時刻との差をミリ秒で返す = toMillisecondsFromNow()
        const delay = alarm.getTime().toMillisecondsFromNow();
        console.log(`delay: ${delay}ms`);

        if (delay <= 0) {
            console.warn("過去の時刻です。タイマーをセットしません。");
            return; // ← ガードを追加
        }

        // window.setTimeout と記載している理由(number型 → ブラウザ前提)
        // ① ブラウザの機能を使っていると明示するため
        // ② 実行環境の違いによる挙動差を防ぐため(Node.jsではTimeoutオブジェクトを返す = 型が違う)
        const alarmTimerId = window.setTimeout(() => {
            // ⇩ handleTimeReached？
            callback(alarm);
            this.alarms.delete(id);
        }, delay);

        this.alarms.set(id, alarmTimerId);
    }

    public stopMonitoring(id: string): void {
        const alarmTimerId = this.alarms.get(id);
        // alarmTimerId が 0 の場合でも falsy になってしまうため(= 0 でも正しく処理させるため)
        if (alarmTimerId !== undefined) {
            clearTimeout(alarmTimerId);
            this.alarms.delete(id);
        }
    }

    /**
     * 全アラームの予約を一括キャンセルするメソッド
     * 画面を閉じる・アプリを終了するケースを考慮
     */
    public stopAll(): void {
        this.alarms.forEach((timerId) =>
            clearTimeout(timerId)
        );

        this.alarms.clear();
    }
}