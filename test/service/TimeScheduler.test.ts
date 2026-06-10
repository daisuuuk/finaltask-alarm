
import { describe, test, expect, vi } from "vitest";
import { TimeScheduler } from "../../src/service/TimeScheduler";

describe("--------------------インフラ層「TimeScheduler」--------------------", () => {
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
});