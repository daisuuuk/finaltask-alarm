
/**
 * ValueObject
 */
export class AlarmTime {
    // public readonly⬇️
    // ① 値は外から参照できる必要がある  
    // ② でも変更はさせない  
    constructor(
        public readonly hour: number,
        public readonly minute: number
    ) {
        if (hour < 0 || hour > 23) {
            throw new Error("hour must be 0-23");
        }
        if (minute < 0 || minute > 59) {
            throw new Error("minute must be 0-59");
        }
    }

    // 中身の値が同じなら同じものとして扱う → 参照された値を！例)07:30 と 07:30 は同じ
    public equals(other: AlarmTime): boolean {
        return this.hour === other.hour && this.minute === other.minute;
    }

    public getHour(): number {
        return this.hour;
    }

    public getMinute(): number {
        return this.minute;
    }

    private toDate(): Date {
        const date = new Date();       // 今日の日付を取得
        date.setHours(this.hour);      // 時を上書き
        date.setMinutes(this.minute);  // 分を上書き
        date.setSeconds(0);            // 秒 はリセット
        date.setMilliseconds(0);       // ms はリセット
        return date;
    }

    // 「現在時刻との差」をミリ秒で返す関数
    public toMillisecondsFromNow(): number {
        // 今この瞬間を数値で返す
        const now = Date.now();                        // 現在時刻(ms)
        // 標準関数「getTime()」 = Date → number への変換。単位をmsに揃える
        // = 設定アラームの時刻(ms)ということ
        const target = this.toDate().getTime();        // アラーム時刻(ms)
        return target - now;                           // 差分を返す
    }
    // ===================================================
    // 具体例：20:00 にアラームをセットした場合
    //     現在時刻: 19: 50:00
    //     アラーム: 20:00:00
    //     差: 10分 = 600秒 = 600,000ミリ秒
    //     delay = 600000
    //      ↓
    //     setTimeout(callback, 600000)
    //      ↓
    //     600,000ms（10分）後に callback 実行 → アラーム鳴動！
    // ===================================================
}