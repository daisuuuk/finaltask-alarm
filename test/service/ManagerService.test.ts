
import { describe, test, expect, vi } from "vitest";
import { ManagerService } from '../../src/service/ManagerService';
import { AlarmList } from '../../src/domain/alarm/AlarmList';
import { AlarmTime } from '../../src/domain/alarm/AlarmTime';

function mockDM() {
    return {
        saveAll: vi.fn(),
        loadAll: vi.fn(),
    };
}

// let dm: ReturnType<typeof mockDM>;

// describe("------------------------------Calculator------------------------------", () => {

//     beforeEach(() => {
//         // dm = mockDM();
//     });
// });

describe("------------------Service層(窓口)「ManagerService」------------------", () => {
    test("No.  正常: 時刻変更(編集)できる", () => {
        const service = new ManagerService(new AlarmList(), mockDM());
        service.saveAlarm(new AlarmTime(10, 0));

        const alarms = service.getAlarms();
        const alarm = alarms[0];

        const result = service.editAlarm(alarm.getId(), new AlarmTime(11, 0));

        expect(result.ok).toBe(true);
    });

    test("No.  異常: 時刻変更(編集)できない → 重複不可", () => {
        const service = new ManagerService(new AlarmList(), mockDM());
        // アラームを生成(2つ)
        service.saveAlarm(new AlarmTime(10, 0));
        service.saveAlarm(new AlarmTime(11, 0));

        const alarms = service.getAlarms();
        // インデックス[1]番目を定義 = 2つ目のアラーム
        const alarm = alarms[1];

        // 重複で変更(編集)できない
        const result = service.editAlarm(alarm.getId(), new AlarmTime(10, 0));

        expect(result.ok).toBe(false);
    });
});

test("No. アラームは未選択で削除できない", () => {

});

test("No. アラームは1件削除できる", () => {
    const service = new ManagerService(new AlarmList(), mockDM());

    service.saveAlarm(new AlarmTime(10, 0));
    const alarms = service.getAlarms();
    const alarm = alarms[0];
    service.deleteMany([alarm.getId()]);

    expect(service.getAlarms().length).toBe(0);
});

test("No. アラームは複数削除できる", () => {
    const service = new ManagerService(new AlarmList(), mockDM());

    service.saveAlarm(new AlarmTime(10, 0));
    service.saveAlarm(new AlarmTime(11, 0));
    service.saveAlarm(new AlarmTime(12, 0));

    const alarms = service.getAlarms();

    const ids = alarms.map(alarm => alarm.getId());

    const result = service.deleteMany(ids);

    expect(service.getAlarms().length).toBe(0);
});

test("No.  存在しないIDは削除できない", () => {
    const service = new ManagerService(new AlarmList(), mockDM());

    const result = service.deleteMany(["not-exist"]);

    expect(service.getAlarms().length).toBe(0);
});

test("No.  一覧: 例)アラームが4件ある", () => {
    const service = new ManagerService(new AlarmList(), mockDM());

    service.saveAlarm(new AlarmTime(10, 0));
    service.saveAlarm(new AlarmTime(10, 30));
    service.saveAlarm(new AlarmTime(12, 0));
    service.saveAlarm(new AlarmTime(17, 10));


    expect(service.getAlarms().length).toBe(4);
});