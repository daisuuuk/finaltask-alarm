
import { Alarm } from "../domain/Alarm";
import { LocalStorageManager } from "./LocalStorageManager";
import { type AlarmDTO, toDTO, fromDTO } from "../domain/AlarmMapper";

/**
 * データの保存・削除・読み込みの役割
 */
export class AlarmDataManager {
    // private storage: LocalStorageManager;
    public constructor(private storage: LocalStorageManager) { }

    /**
     * アラームのデータを保存する為(重複禁止や最大件数も)のメソッド
     * @param alarms 
     */
    public saveAll(alarms: Alarm[]): void {
        // { 下記１行は保存前の各処理⇩⇩
        // - alarms.push(alarm)
        // - this.persistToStorage()
        // }

        // ①Alarm[]をDTOへ変換
        const dtoList = alarms.map(toDTO);
        // ②オブジェクトを文字列へ(扱える形に)
        const json = JSON.stringify(dtoList);
        // ③キーと値のペアで保存する
        this.storage.saveAlarmData("alarms", json);
    }

    public loadAll(): Alarm[] {
        // ①キーで読み込み取得する
        const json = this.storage.loadAlarmData("alarms");
        // ②キーが見当たらなければ、空の配列を返す(ガード)
        if (!json) {
            return [];
        }

        // ③文字列にしたものを、元のオブジェクトへ戻す
        const dtoList = JSON.parse(json) as AlarmDTO[];
        // ④DTOをAlarm[]へ復元
        return dtoList.map(fromDTO);
    }

    /**
     * アラームのデータを全件削除する為のメソッド
     */
    public resetAll(): Alarm[] {
        // 下記１行は保存前の各処理⇩⇩
        // - this.alarms = [];
        // - this.persistToStorage();
    }

    /**
     * アラームのデータを１件削除する為のメソッド
     * @param id 
     */
    public delete(id: string): void {
        // { 下記１行は保存前の各処理⇩⇩
        // - alarms.filter()
        // 丸ごと上書き保存 ⇩⇩⇩
        // - this.persistToStorage()
        // }
    }

    /**
     * 永続的に保存する 共通メソッド 
     */
    private persistToStorage(): void {
        // { this.storage.saveAlarmData(this.alarms)}
    }

}