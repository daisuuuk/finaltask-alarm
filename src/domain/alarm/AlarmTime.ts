
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
        // Number.isInteger() = 値が整数かどうかbooleanで返す
        if (!Number.isInteger(hour) || hour < 0 || hour > 23) {
            throw new Error("hour must be 0-23");
        }
        if (!Number.isInteger(minute) || minute < 0 || minute > 59) {
            throw new Error("minute must be 0-59");
        }
    }

    // 中身の値が同じなら同じものとして扱う → 参照された値を！例)07:30 と 07:30 は同じ
    public equals(other: AlarmTime): boolean {
        return this.hour === other.hour && this.minute === other.minute;
    }

    /**
     * 時間を取得する
     * @returns number
     */
    public getHour(): number {
        return this.hour;
    }

    /**
     * 分を取得する
     * @returns number
     */
    public getMinute(): number {
        return this.minute;
    }

    /**
     * このクラスが持つ hour と minute を、Dateオブジェクトに変換するメソッド
     * 今日の日付からアラーム時刻を作るメソッド
     * @returns Date
     */
    public toDateFromBase(base: Date): Date {
        const date = new Date(base);   // 今日の日付を取得
        date.setHours(this.hour);      // 時を上書き
        date.setMinutes(this.minute);  // 分を上書き
        date.setSeconds(0);            // 秒 はリセット
        date.setMilliseconds(0);       // ms はリセット

        return date;
    }
    // ===================================================
    // 今日の日付: 2026-06-01  15: 32: 45.123
    //            ↓ 時・分・秒・msを上書き
    // 結果: 2026-06-01[this.hour]: [this.minute]:00.000
    // ===================================================

    /**
     * 「現在時刻との差」をミリ秒で返す関数
     * 「今（ms）」の時刻を引数に「今日のアラーム時刻（ms）」を作って引き算する
     * @returns number
     */
    // 現在時刻を外から渡す！！→現在時刻が毎回変わるので、テスト時に固定できないのを防ぐ
    public toMillisecondsFromNow(now: number): number {
        // ❷Dataに変換 → 例)1717132800000 → 2026-01-01 10:00:00
        const nowDate = new Date(now);
        // 標準関数「getTime()」 = Date → number への変換。単位をmsに揃える
        // = ❸設定アラームの時刻(ms)を取得し ↑
        const target = this.toDateFromBase(nowDate);
        // ❹設定アラームの時刻(ms) - 現在時刻(ms)
        // return target - now;         
        let diff = target.getTime() - now;

        if (diff <= 0) {
            target.setDate(target.getDate() + 1);
            diff = target.getTime() - now;
            console.log("翌日の時刻として設定されました")
        }

        return diff;
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