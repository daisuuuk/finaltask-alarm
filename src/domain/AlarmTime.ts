
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
}