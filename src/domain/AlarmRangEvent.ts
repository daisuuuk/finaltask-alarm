
import { AlarmTime } from "./AlarmTime";

/**
 * 「何が起きたか」だけを表すクラス(イベントデータ)どのアラームが・いつなったか「ServiceとList」
 *  eventがあると、処理を後から自由に追加できる(拡張性)今回の場合、「音を鳴らす」のと「ダイアログを表示」
 */
export class AlarmRangEvent {
    public constructor(alarmId: string, time: AlarmTime) {}
    // public readonly alarmId: string,
    // public readonly time: AlarmTime,
}