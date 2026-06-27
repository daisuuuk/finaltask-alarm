
import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { TimeScheduler } from "../../src/service/TimeScheduler";
import { Alarm } from "../../src/domain/alarm/Alarm";
import { AlarmTime } from "../../src/domain/alarm/AlarmTime";

describe("--------------------インフラ層「TimeScheduler」--------------------", () => {

    // 「setTimeout、setInterval、Date.now」などを全部テスト用の偽物に置き換える
    beforeEach(() => {
        vi.useFakeTimers();
    });

    // 「フェイクタイマー状態を元に戻す」ための後片付け（重要）
    afterEach(() => {
        vi.useRealTimers();
    });

    test("No. 正常系: アラームを削除したらタイマー(監視)が消える", () => {
        const scheduler = new TimeScheduler();

        const id = "test-id";
        const timerId = 123;

        scheduler["alarms"].set(id, timerId);

        // clearTimeoutを監視
        // spyOn = 呼ばれた回数・引数を記録する
        // global = グローバルオブジェクト
        // spyOnは「オブジェクトのプロパティ」を監視するので、clearTimeout単体は関数なので❌
        const spy = vi.spyOn(globalThis, "clearTimeout");

        // 中で clearTimeout(timerId) が呼ばれる
        scheduler.stopMonitoring(id);

        // 正しいIdで clearTimeout が呼ばれたかどうか
        expect(spy).toHaveBeenCalledWith(timerId);
    });

    test("No. 正常系: アラーム停止後(OFF)は鳴らない", () => {
        const scheduler = new TimeScheduler();
        const callback = vi.fn();

        const alarm = Alarm.createAlarm(new AlarmTime(10, 0));

        // mock化
        vi.spyOn(alarm.getTime(), "toMillisecondsFromNow")
            .mockReturnValue(1000);

        const alarmId = alarm.getId();

        scheduler.startMonitoring(alarm, callback);

        scheduler.stopMonitoring(alarmId);

        vi.advanceTimersByTime(2000);

        expect(callback).not.toHaveBeenCalled();
    });

    test("設定した時刻が同時刻なら鳴らない", () => {
        const scheduler = new TimeScheduler();
        const callback = vi.fn();

        const alarm = Alarm.createAlarm(new AlarmTime(10, 0));

        // ***24時間後に鳴る設定***
        vi.spyOn(alarm.getTime(), "toMillisecondsFromNow")
            .mockReturnValue(24 * 60 * 60 * 1000);

        scheduler.startMonitoring(alarm, callback);

        vi.advanceTimersByTime(1000);

        expect(callback).not.toHaveBeenCalled();
    });

    test("設定した時刻が未来時刻なら鳴る", () => {
        const scheduler = new TimeScheduler();
        const callback = vi.fn();

        const alarm = Alarm.createAlarm(new AlarmTime(10, 1));

        vi.spyOn(alarm.getTime(), "toMillisecondsFromNow")
            .mockReturnValue(1000);

        scheduler.startMonitoring(alarm, callback);

        vi.advanceTimersByTime(1000);

        expect(callback).toHaveBeenCalled();
    });

    test("設定した時刻が過去時刻なら鳴らない", () => {
        const scheduler = new TimeScheduler();
        const callback = vi.fn();

        const alarm = Alarm.createAlarm(new AlarmTime(10, 0));

        // ***23時間59分後に鳴る設定***
        // 翌日の9:59までの時間（＝23時間59分）」になっているかを確認
        // 1380分(23時間) + 59分 = 1439分  × 60秒 × 1000ms
        vi.spyOn(alarm.getTime(), "toMillisecondsFromNow")
            .mockReturnValue((23 * 60 + 59) * 60 * 1000);

        scheduler.startMonitoring(alarm, callback);

        vi.advanceTimersByTime(1000);

        expect(callback).not.toHaveBeenCalled();
    });

});