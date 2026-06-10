
import { describe, test, expect } from "vitest";
import { AlarmTime } from '../../src/domain/alarm/AlarmTime';

describe("--------------------ドメイン層「AlarmTime」--------------------", () => {
    test("No. 正常系: hourが0はOK", () => {
        expect(() => new AlarmTime(0, 0)).not.toThrow();
    });

    test("No. 正常系: hourが23はOK", () => {
        expect(() => new AlarmTime(23, 0)).not.toThrow();
    });

    test("No. 正常系: hourが1はOK", () => {
        expect(() => new AlarmTime(1, 0)).not.toThrow();
    });

    test("No. 正常系: hourが22はOK", () => {
        expect(() => new AlarmTime(22, 0)).not.toThrow();
    });

    test("No. 正常系: hourが10はOK（同値分割の代表値）", () => {
        expect(() => new AlarmTime(10, 0)).not.toThrow();
    });

    // ----------

    test("No. 正常系: minuteが0はOK", () => {
        expect(() => new AlarmTime(0, 0)).not.toThrow();
    });

    test("No. 正常系: minuteが59はOK", () => {
        expect(() => new AlarmTime(0, 59)).not.toThrow();
    });

    test("No. 正常系: minuteが1はOK", () => {
        expect(() => new AlarmTime(0, 1)).not.toThrow();
    });

    test("No. 正常系: minuteが58はOK", () => {
        expect(() => new AlarmTime(0, 58)).not.toThrow();
    });

    test("No. 正常系: minuteが10はOK（同値分割の代表値）", () => {
        expect(() => new AlarmTime(0, 10)).not.toThrow();
    });

    // ----------

    test("No. 異常系: hourが24ならエラー", () => {
        expect(() => new AlarmTime(24, 0)).toThrow();
    });

    test("No. 異常系: minuteが60ならエラー", () => {
        expect(() => new AlarmTime(0, 60)).toThrow();
    });

    test("No. 異常系: hourが小数ならエラー", () => {
        expect(() => new AlarmTime(1.5, 0)).toThrow();
    });

    test("No. 異常系: minuteが小数ならエラー", () => {
        expect(() => new AlarmTime(0, 1.5)).toThrow();
    });

    test("No. 異常系: hourが-1ならエラー", () => {
        expect(() => new AlarmTime(-1, 0)).toThrow();
    });

    test("No. 異常系: minuteが-1ならエラー", () => {
        expect(() => new AlarmTime(0, -1)).toThrow();
    });

    test("No. 異常系: hourが非文字(NaN)ならエラー", () => {
        expect(() => new AlarmTime(NaN, 0)).toThrow();
    });

    test("No. 異常系: minuteが非文字(NaN)ならエラー", () => {
        expect(() => new AlarmTime(0, NaN)).toThrow();
    });

});