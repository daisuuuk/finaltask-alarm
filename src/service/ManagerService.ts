
import { Alarm } from "../domain/Alarm";
import { AlarmTime } from "../domain/AlarmTime";
import { AlarmList } from "../domain/AlarmList";
import { type IAlarmDataManager } from "../infra/AlarmDataManager";
import { type Result, type AlarmViolationType, type IManagerService } from "../controller/AlarmDisplayController";

export type AlarmRemovedListener = (id: string) => void;

export class ManagerService implements IManagerService {
    constructor(
        private alarmList: AlarmList,
        // private dataManager: AlarmDataManager,
        private dataManager: IAlarmDataManager,
    ) { }

    /**
     * 
     * @param listener 
     * ❷「(id) => stopAlarmMonitoring(id)」を持って、onRemovedに渡す。
     */
    public onAlarmRemoved(listener: AlarmRemovedListener): void {
        this.alarmList.onRemoved(listener);
    }

    /**
     * ON/OFF切り替えメソッドを呼び出すメソッド
     */
    public toggleAlarm(id: string): void {
        const alarm = this.findById(id);
        // ON/OFF変えるのは、1件だけに制限
        // if (id.length !== 1) {
        //     return;
        // }
        if (!alarm) {
            return;
        }

        alarm.toggleOnOff();
    }

    /**
     * 初期ロード = アプリ起動時に保存データをメモリに復元する処理(LocalStorageにはあるがListには無くなっている)
     * 起動時に「ローカルストレージ不整合時は初期化」を行い、その後「過去時刻の未処理アラーム判定」を行う(同時)
     */
    public initialLoad(): void {
        const alarms = this.dataManager.loadAll();
        this.alarmList.setAll(alarms);
        console.log("現在の件数", this.alarmList.getAll().length);
    }

    /**
     * 過去時刻の未処理アラーム判定メソッド と 起動時に通知
     */
    // public checkMissedAlarms(): void {
        // this.dataManager.loadAll(): Alarm[]
        // 通知メソッド()
    // }

    /**
     * １件削除・全件削除
     */
    public deleteMany(ids: string[]): void {
        if (ids.length === 0) {
            // return { ok: false, error: new AlarmNotFoundViolation() };
            return;
        }

        for (const id of ids) {
            this.delete(id);
        }

        this.dataManager.saveAll(this.alarmList.getAll());
    }

    public delete(id: string): void {
        this.alarmList.remove(id);
    }

    /**
     * 追加ボタン+が押下されたよ！
     */
    public canAddAlarm(): boolean {
        return this.alarmList.isAlarmSetLimit();
    }

    public editAlarm(id: string, time: AlarmTime): Result<void, AlarmViolationType> {
        const list = this.alarmList.editAlarm(id, time);
        // okではないなら→保存できなかったなら = 何らかのバリデーションが処理された場合
        if (list.ok === false) {
            // UIに「保存できなったという結果」を返す
            return list;
        }

        // ③add()で箱へ追加したアラームを保存する
        this.dataManager.saveAll(this.alarmList.getAll());

        return { ok: true, value: undefined };
    }

    // 同時刻がないかどうか
    /**
     * 取得した「時間・分」からアラームを生成し、
     * @param time 
     * @returns 保存できるかどうかの結果を返す
     * @remark
     * - 保存できない場合は
     */
    public saveAlarm(time: AlarmTime): Result<void, AlarmViolationType> {
        // ①アラーム生成
        const alarm = Alarm.createAlarm(time);

        // this.alarmList.validateDuplicate(alarm.getTime());
        // ②アラーム追加関数(バリデーションチェック)
        const list = this.alarmList.addAlarm(alarm);
        // okではないなら→保存できなかったなら = 何らかのバリデーションが処理された場合
        if (list.ok === false) {
            // UIに「保存できなったという結果」を返す
            return list;
        }

        // ③add()で箱へ追加したアラームを保存する
        this.dataManager.saveAll(this.alarmList.getAll());

        return { ok: true, value: undefined };
    }

    public getAlarms(): Alarm[] {
        return this.alarmList.getAll();
    }

    public findById(id: string): Alarm | undefined {
        return this.alarmList.findById(id);
    }

}