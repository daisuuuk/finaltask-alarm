
import { describe, test, expect, vi } from "vitest";
import { ExecutionService } from '../../src/service/ExecutionService';
import { Alarm } from '../../src/domain/alarm/Alarm';
import { AlarmTime } from '../../src/domain/alarm/AlarmTime';
import { TimeScheduler } from "../../src/service/TimeScheduler";

function mockSound() {
    return {
        startSound: vi.fn(),
        stopSound: vi.fn(),
    };
}

describe("--------------------Service層(窓口)「ExecutionService」--------------------", () => {
    test("No. 分岐: 時刻到達でlistenerが呼ばれる", () => {
        const service = new ExecutionService(new TimeScheduler(), mockSound());

        let called = false;

        service.timeReached(() => {
            called = true;
        });

        service["handleTimeReached"](Alarm.createAlarm(new AlarmTime(10, 0)));

        expect(called).toBe(true);
    });

    test("No. 正常: listener未設定でもエラーにならない", () => {
        const service = new ExecutionService(new TimeScheduler(), mockSound());

        expect(() => {
            service["handleTimeReached"](Alarm.createAlarm(new AlarmTime(10, 0)));
        }).not.toThrow();
        // ↑ 例外を投げないということ
    });

    // 監視開始していない状態で監視停止を呼んでも安全に無視できるか(= ガードができているか)
    test("No. 正常: アラーム開始監視前にアラーム監視停止してもエラーにならない(= 状態チェック)", () => {
        const service = new ExecutionService(new TimeScheduler(), mockSound());

        expect(() => {
            service.stopAlarmMonitoring("not-exists-id");
        }).not.toThrow();
    });

    test("No. : 音停止処理が複数回呼ばれても安全", () => {
        const service = new ExecutionService(new TimeScheduler(), mockSound());

        expect(() => {
            service.stopAlarm();
            service.stopAlarm();
        }).not.toThrow();
    });

    test("No. 正常: stopAlarm(音停止)で音が止まる", () => {
        const sound = mockSound();
        const service = new ExecutionService(new TimeScheduler(), sound);

        const alarm = Alarm.createAlarm(new AlarmTime(10, 0));
        // 鳴動状態にする
        service["handleTimeReached"](alarm);

        service.stopAlarm();

        expect(alarm.isRinging()).toBe(false);
        expect(sound.stopSound).toHaveBeenCalled();
    });

    test("No. 正常: OFFのアラームは鳴らない", () => {
        const sound = mockSound();
        const service = new ExecutionService(new TimeScheduler(), sound);

        const alarm = Alarm.createAlarm(new AlarmTime(10, 0));
        alarm.toggleOnOff();
        // alarm.stopRinging();

        service["handleTimeReached"](alarm);

        expect(alarm.isRinging()).toBe(false);
        expect(sound.startSound).not.toHaveBeenCalled();
    });

});