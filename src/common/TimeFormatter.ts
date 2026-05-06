
import { AlarmTime } from "../domain/AlarmTime";

/**
 * 時間形式クラス
 */
export class TimeFormatter {
    // 秒を "MM:SS" 形式にフォーマットする。タイマー向け
    // formatSeconds(seconds: number): string {}

    // 時・分を "HH:MM" 形式にフォーマットする。アラーム向け
    formatHourMinute(time: AlarmTime): string {
        // 「padStart(2, "0")」 = 元の文字列が2桁に満たない場合、先頭に「0」を自動的に補完して合計2桁にする
        const hourDisplay = time.hour.toString();
        const minuteDisplay = time.minute.toString().padStart(2, "0");
        return `${hourDisplay}:${minuteDisplay}`;
    }
    // { 例: (9, 5) → "9:05" }
    // format(time: AlarmTime): string
}