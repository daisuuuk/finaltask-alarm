
import { describe, test, expect } from "vitest";
import { Alarm } from '../../src/domain/alarm/Alarm';
import { AlarmList } from '../../src/domain/alarm/AlarmList';
import { AlarmTime } from '../../src/domain/alarm/AlarmTime';

describe("--------------------ドメイン層「AlarmList」--------------------", () => {
    test("No.2 正常: アラームを追加(保存)できる", () => {
        const list = new AlarmList();
        const alarm = Alarm.createAlarm(new AlarmTime(10, 0));
        const result = list.addAlarm(alarm);

        expect(result.ok).toBe(true);
        expect(list.getAll().length).toBe(1);
    });

    test("No. 境界値: 「00:00」でアラームを追加(保存)できる", () => {
        const list = new AlarmList();
        const alarm = Alarm.createAlarm(new AlarmTime(0, 0));
        const result = list.addAlarm(alarm);

        expect(result.ok).toBe(true);
        expect(list.getAll().length).toBe(1);
    });

    test("No. 境界値: 「23:59」でアラームを追加(保存)できる", () => {
        const list = new AlarmList();
        const alarm = Alarm.createAlarm(new AlarmTime(23, 59));
        const result = list.addAlarm(alarm);

        expect(result.ok).toBe(true);
        expect(list.getAll().length).toBe(1);
    });

    test("No.3 異常: アラーム設定件数は5件まで", () => {
        const list = new AlarmList();

        // ５件追加
        for (let i = 0; i < 5; i++) {
            list.addAlarm(Alarm.createAlarm(new AlarmTime(i, 0)));
        }

        // ６件目
        const result = list.addAlarm(Alarm.createAlarm(new AlarmTime(6, 0)));

        expect(result.ok).toBe(false);
    });

    test("No. 異常: アラーム設定5件で再度読み込むと5件表示される", () => {
        const list = new AlarmList();

        // ５件追加
        for (let i = 0; i < 5; i++) {
            list.addAlarm(Alarm.createAlarm(new AlarmTime(i, 0)));
        }

        expect(list.getAll().length).toBe(5);
    });

    test("No.4 異常: 同時刻は追加できない", () => {
        const list = new AlarmList();

        list.addAlarm(Alarm.createAlarm(new AlarmTime(10, 0)));
        const result = list.addAlarm(Alarm.createAlarm(new AlarmTime(10, 0)));

        expect(result.ok).toBe(false);
    });

    test("No. 正常: 初期状態はアラームは0件", () => {
        const list = new AlarmList();

        expect(list.getAll().length).toBe(0);
    });

});