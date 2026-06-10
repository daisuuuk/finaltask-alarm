
import { describe, test, expect } from "vitest";
import { Alarm } from '../../src/domain/alarm/Alarm';
import { AlarmTime } from '../../src/domain/alarm/AlarmTime';

describe("--------------------ドメイン層「Alarm」--------------------", () => {
    test("No. 正常: toggleボタンのON/OFF切替", () => {
        const alarm = Alarm.createAlarm(new AlarmTime(10, 0));

        alarm.toggleOnOff();
        expect(alarm.isActive()).toBe(false);

        alarm.toggleOnOff();
        expect(alarm.isActive()).toBe(true);

    });

    test("No. 正常: あるアラームをONにしても他には影響しない", () => {
        const alarmA = Alarm.createAlarm(new AlarmTime(10, 0));
        const alarmB = Alarm.createAlarm(new AlarmTime(11, 0));

        alarmA.toggleOnOff();
        expect(alarmA.isActive()).toBe(false);
        expect(alarmB.isActive()).toBe(true);
    });

    test("No. 正常: アラーム初期状態はON", () => {
        const alarm = Alarm.createAlarm(new AlarmTime(10, 0));

        expect(alarm.isActive()).toBe(true);
    });

    test("No. 境界値: 未来時刻なら正の値になる", () => {
        const base = new Date("2026-01-01T10:00:00").getTime();
        const alarm = new AlarmTime(10, 1);

        const delay = alarm.toMillisecondsFromNow(base);

        expect(delay).toBe(60 * 1000);
    });

    test("No. 境界値: 過去時刻は翌日になる", () => {
        const base = new Date("2026-01-01T10:00:00").getTime();
        const alarm = new AlarmTime(9, 59);

        const delay = alarm.toMillisecondsFromNow(base);

        // 翌日の9:59までの時間（＝23時間59分）」になっているかを確認
        // 23時間 = 1380分 + 59分 = 1439分
        expect(delay).toBe((23 * 60 + 59) * 60 * 1000);
    });

    test("No. 境界値: 同一時刻は翌日になる", () => {
        const base = new Date("2026-01-01T10:00:00").getTime();
        const alarm = new AlarmTime(10, 0);

        const delay = alarm.toMillisecondsFromNow(base);

        // 24時間 × 60分 × 60秒 × 1000ms
        //     = 86, 400,000 ms(1日分のミリ秒)
        expect(delay).toBe(24 * 60 * 60 * 1000);
    });

    test("指定時間後にコールバックが呼ばれる", () => {
        // vi.useFakeTimers();

        // const callback = vi.fn();
        // const scheduler = new Scheduler();

        // const alarm = new Alarm(new AlarmTime(10, 1));

        // scheduler.startMonitoring(alarm, callback);

        // vi.advanceTimersByTime(60 * 1000);

        // expect(callback).toHaveBeenCalled();
    });
});