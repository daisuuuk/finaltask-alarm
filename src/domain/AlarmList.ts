
import { Alarm } from "./Alarm";
import { AlarmTime } from "./AlarmTime";
import { AlarmRangEvent } from "./AlarmRangEvent";
import { DuplicateAlarmTimeViolation } from "../violation/DuplicateAlarmTimeViolation";
import { AlarmLimitExceededViolation } from "../violation/AlarmLimitExceededViolation";
import { type Result, type AlarmViolationType } from "../controller/AlarmDisplayController";

/**
 * アラームの集合管理(メモリ上管理)
 * ⇨ アラームの一覧を動かす(管理)ため
 */
export class AlarmList {
    private alarms: Alarm[] = [];
    private readonly MAX_SET_LIMIT = 5;
    // 削除された時に呼ばれる関数のリスト
    private listeners: ((id: string) => void)[] = [];

    public stop(id: string): void {
        // const alarm = this.getFindAlarm(id);
        // alarm.isStop();
    }

    /**
     * アラーム保存処理の結果をResultで返すメソッド(ユーザー操作・バリデーションの為)
     * @param alarm 
     * @returns 
     */
    public addAlarm(alarm: Alarm): Result<void, AlarmViolationType> { // : Result<void>
        // this.validateLimit();
        // this.validateDuplicate(alarm.getTime());
        // this.alarms.push(alarm);

        // ①件数チェック
        if (this.isAlarmSetLimit() === false) {
            // throw new Error("上限です");
            return { ok: false, error: new AlarmLimitExceededViolation() };
        }
        // ②重複チェック
        if (this.isAlarmDuplicate(alarm.getTime())) {
            // throw new Violation("同じ時刻があります");
            return { ok: false, error: new DuplicateAlarmTimeViolation() };
        }

        // ③特に問題なければ箱へ追加
        this.alarms.push(alarm);
        return { ok: true, value: undefined };
    }

    /**
     * 編集を保存する
     * @param time 
     * @param id 
     */
    public editAlarm(id: string, time: AlarmTime): Result<void, AlarmViolationType> {
        // ーーー例外エラーverーーー
        // const target = this.getFindAlarm(id);
        // 自分以外で重複チェック
        // const exists = this.alarms.some(a =>
        // a.getId() !== id &&
        // a.getTime().equals(time)
        // );
        // if (exists) {
        // throw new DuplicateAlarmTimeError();
        // }
        // target.changeTime(time);
        // ーーーResult型ーーー
        // ①重複チェック
        // ❶同じものを探す = 自分以外で、同じ時間のアラームが1つでも存在するか？
        const existDuplicateAlarm = this.alarms.some(alarm =>
            // ❷すでにあるアラームのid と 選択中のid が異なる　かつ = 編集中のアラーム自身は無視
            alarm.getId() !== id &&
            // ❸時間が重複しているもの
            alarm.getTime().equals(time)
        );
        // ❹ある場合、警告表示
        if (existDuplicateAlarm) {
            return { ok: false, error: new DuplicateAlarmTimeViolation() };
        }

        // ②更新する
        const alarm = this.findById(id);
        if (!alarm) {
            // DuplicateAlarmTimeViolation() これではなく「アラームが見つかりません」的なものを用意！！！
            return { ok: false, error: new DuplicateAlarmTimeViolation() };
        }

        // ③中身を書き換え
        alarm.updateTime(time);

        return { ok: true, value: undefined };
    }

    public remove(id: string): void {
        // アラームデータ削除
        // 絞り込むという認識 → 今回、指定したID以外だけ残す = 削除したいIDじゃないものだけ残す = 選択されたidを削除したい
        this.alarms = this.alarms.filter(alarm => alarm.getId() !== id);
        // idが削除された事を通知する
        this.notifyRemoved(id);
    }

    // 削除されたらこの処理をすように登録　⇩⇩
    public onRemoved(listener: (id: string) => void): void {
        this.listeners.push(listener);
    }
    // 「main.ts」alarmList.onRemoved(id => scheduler.cancel(id));
    // 削除されたら、スケジューラも止める
    // alarmList.onRemoved(() => {this.updateUi();}); イベント駆動UI
    
    // idが削除された事を通知する
    private notifyRemoved(id: string): void {
        this.listeners.forEach(l => l(id));
    }

    /**
     * find は「条件に合う最初の1件を返す」
     * 見つからなければ undefined を返す
     * @param id 
     */
    public findById(id: string): Alarm | undefined {
        return this.alarms.find(alarm => alarm.getId() === id);
    }

    /**
     * 設定可能件数かどうかの判別を「boolean」で返す
     * @returns 
     */
    public isAlarmSetLimit(): boolean {
        return this.alarms.length < this.MAX_SET_LIMIT;
    }

    private isAlarmDuplicate(time: AlarmTime): boolean {
        return this.alarms.some(alarm =>
            alarm.getTime().equals(time)
        );
    }

    public getAll(): Alarm[] {
        return this.alarms;
    }

    public setAll(alarms: Alarm[]): void {
        this.alarms = alarms;
    }

    /**
     * アラームの状態変更
     * @param now 
     */
    // public changeState(now: AlarmTime): AlarmRangEvent[] {
        // const events: AlarmRangEvent[] = [];
        // for (const alarm of this.alarms) 
        // if (alarm.getTime().equals(now)) {
        // alarm.isRing(); // ← 状態変更はここ
        // events.push(
        // new AlarmRangEvent(alarm.getId(), now)
        //  );
        // }
        //   }
        //  return events;
        // }
    // }

    private validateLimit(): void {
        // ーーー例外エラーverーーー
        // if (this.alarms.length >= 5) {
        //   throw new AlarmLimitExceededError();
        // }
        // ーーーResult型ーーー
        // if (this.alarms.length >= 5) {
        // return { ok: false, error: new AlarmLimitExceededError() };
        // }
    }

    public validateDuplicate(time: AlarmTime): void {
        // ーーー例外エラーverーーー
        // const exists = this.alarms.some(a =>
        //   a.getTime().equals(time)
        // );
        // if (exists) {
        //   throw new DuplicateAlarmTimeError();
        // }
        // ーーーResult型ーーー
        // const exists = this.alarms.some(a =>
        // a.getTime().equals(time)
        // );
        // if (exists) {
        // return { ok: false, error: new DuplicateAlarmTimeError() };
        // }
        // this.alarms.push(alarm);
        // return { ok: true, value: undefined };
    }
}