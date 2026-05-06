
// 「vi.fn()」 = 偽物の関数 → 呼ばれたかどうかだけ確認

// ----------------------------

import { describe, test, expect, vi, beforeEach } from "vitest";
import type { Mock } from "vitest";

import { Button } from '../../src/common/Button';
import { AlarmDisplayController, Result, AlarmViolationType } from '../../src/controller/AlarmDisplayController';
import { DomDisplay } from '../../src/display/DomDisplay';
import { IDisplay, IAddDisplay, IListDisplay, IRuleDisplay } from '../../src/display/IDisplay';
import { ManagerService } from '../../src/service/ManagerService';
import { ExecutionService } from '../../src/service/ExecutionService';
import { AlarmDataManager } from '../../src/infra/AlarmDataManager';
import { Alarm } from '../../src/domain/Alarm';
import { AlarmList } from '../../src/domain/AlarmList';
import { AlarmTime } from '../../src/domain/AlarmTime';
import { DuplicateAlarmTimeViolation } from '../../src/violation/DuplicateAlarmTimeViolation';
import { Buttons } from "../../src/domain/ButtonType";

// 呼び出しだけチェック
describe("--------------------UI層--------------------", () => {
    test("No.1 正常: アラーム追加画面を表示できる", () => {
        // const mockButton = { setOnClick: vi.fn() } as unknown as Button;
        // const mockDisplay = { show: vi.fn() };

        // const controller = new UIController(
        //     mockDisplay,
        //     {} as any,
        //     {} as any
        // );

        // controller.registerButton(ButtonType.ADD, mockButton);

        // // コールバック取得
        // const callback = mockButton.setOnClick.mock.calls[0][0];
        // callback();

        // expect(mockDisplay.show).toHaveBeenCalled();

        const mockDisplay: IAddDisplay & IListDisplay & IRuleDisplay = {
            renderAdd: vi.fn(),
            renderList: vi.fn(),
            renderRule: vi.fn(),
        };

        const mockManagerService: Pick<ManagerService,
            | "saveAlarm"
            | "getAlarms"
            | "initialLoad"
            | "canAddAlarm"
        > = {
            saveAlarm: vi.fn(() => ({ ok: true, value: undefined } as const)),
            // saveAlarm: vi.fn(
            //     (): Result<void, AlarmViolationType> => ({
            //         ok: true,
            //         value: undefined,
            //     })
            // ),
            getAlarms: vi.fn(() => []),
            initialLoad: vi.fn(),
            canAddAlarm: vi.fn(() => true),
        };

        const mockExecutionService: Pick<ExecutionService,
            | "stopAlarm"
        > = {
            stopAlarm: vi.fn(),
        };

        const ui = new AlarmDisplayController(mockDisplay, mockDisplay, mockDisplay, mockManagerService, mockExecutionService);

        ui["onButtonClicked"]("ADD");

        // --- 検証 ---
        expect(mockManagerService.canAddAlarm).toHaveBeenCalled();
        expect(mockDisplay.renderAdd).toHaveBeenCalled();
    });

    test("No. コールバックでSAVEが呼ばれているか", () => {
        // const mockButton: Button = {
        //     setOnClick: vi.fn(),
        // };

        // const mockService: Pick<AlarmService,
        //     | "saveAlarm"
        //     | "getAlarms"
        //     | "initialLoad"
        //     | "canAddAlarm"
        //     | "stopAlarm"
        // > = {
        //     saveAlarm: vi.fn(() => ({ ok: true, value: undefined } as const)),
        //     // saveAlarm: vi.fn(
        //     //     (): Result<void, AlarmViolationType> => ({
        //     //         ok: true,
        //     //         value: undefined,
        //     //     })
        //     // ),
        //     getAlarms: vi.fn(() => []),
        //     initialLoad: vi.fn(),
        //     canAddAlarm: vi.fn(() => true),
        //     stopAlarm: vi.fn(),
        // };

        // const mockDisplay: IAddDisplay & IListDisplay & IRuleDisplay = {
        //     renderAdd: vi.fn(),
        //     renderList: vi.fn(),
        //     renderRule: vi.fn(),
        // };

        // const ui = new AlarmDisplayController(mockDisplay, mockDisplay, mockDisplay, mockService);

        // ui.registerButton(Buttons.ADD, mockButton);

        // // コールバック取得
        // // const callback = mockButton.setOnClick.mock.calls[0][0];
        // // callback();
        // const clickHandler = (mockButton.setOnClick as ReturnType<typeof vi.fn>).mock.calls[0][0];
        // clickHandler();

        // expect(mockDisplay.renderAdd).toHaveBeenCalled();
    });

    test("No. 正常: 「保存ボタン」押下で一覧表示される", () => {

        document.body.innerHTML = `
        <input id="hour" value="10" />
        <input id="minute" value="30" />
        `;

        const mockDisplay: IAddDisplay & IListDisplay & IRuleDisplay = {
            renderAdd: vi.fn(),
            renderList: vi.fn(),
            renderRule: vi.fn(),
        };

        const mockManagerService: Pick<ManagerService,
            | "saveAlarm"
            | "getAlarms"
            | "initialLoad"
            | "canAddAlarm"
        > = {
            saveAlarm: vi.fn(() => ({ ok: true, value: undefined } as const)),
            // saveAlarm: vi.fn(
            //     (): Result<void, AlarmViolationType> => ({
            //         ok: true,
            //         value: undefined,
            //     })
            // ),
            getAlarms: vi.fn(() => []),
            initialLoad: vi.fn(),
            canAddAlarm: vi.fn(() => true),
        };

        const mockExecutionService: Pick<ExecutionService,
            | "stopAlarm"
        > = {
            stopAlarm: vi.fn(),
        };

        const ui = new AlarmDisplayController(mockDisplay, mockDisplay, mockDisplay, mockManagerService, mockExecutionService);

        // ui.onSave();
        ui["onButtonClicked"]("SAVE");

        expect(mockDisplay.renderList).toHaveBeenCalled();
    });

    test("No. 異常: 「保存ボタン」押下時の重複時はルール表示される", () => {
        // document.body.innerHTML = `
        // <input id="hour" value="10" />
        // <input id="minute" value="30" />
        // `;

        // const mockDisplay: IAddDisplay & IListDisplay & IRuleDisplay = {
        //     renderAdd: vi.fn(),
        //     renderList: vi.fn(),
        //     renderRule: vi.fn(),
        // };

        // const mockService: Pick<AlarmService,
        //     | "saveAlarm"
        //     | "getAlarms"
        //     | "initialLoad"
        //     | "canAddAlarm"
        //     | "stopAlarm"
        // > = {
        //     saveAlarm: vi.fn(() => ({ ok: false, error: new DuplicateAlarmTimeViolation() } as const)),
        //     // saveAlarm: vi.fn(
        //     //     (): Result<void, AlarmViolationType> => ({
        //     //         ok: true,
        //     //         value: undefined,
        //     //     })
        //     // ),
        //     getAlarms: vi.fn(() => []),
        //     initialLoad: vi.fn(),
        //     canAddAlarm: vi.fn(() => true),
        //     stopAlarm: vi.fn(),
        // };

        // const ui = new AlarmDisplayController(mockDisplay, mockDisplay, mockDisplay, mockService);

        // ui["onButtonClicked"]("SAVE");

        // expect(mockDisplay.renderRule).toHaveBeenCalled();

        // expect(mockDisplay.renderList).not.toHaveBeenCalled();
    });

});



describe("--------------------ドメイン層--------------------", () => {
    test("No.2 正常: アラームを追加(保存)できる", () => {
        // const display = new DomDisplay();
        // ① const ui = new AlarmDisplayController();
        const list = new AlarmList();
        // ② const service = new

        // ③ ui.getSelectedTime();
        const alarm = Alarm.createAlarm(new AlarmTime(10, 0));
        const result = list.addAlarm(alarm);

        expect(result.ok).toBe(true);
        // ④ display.renderList(this.service.getAlarms());
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

    test("No.4 異常: 同時刻は追加できない", () => {
        const list = new AlarmList();

        list.addAlarm(Alarm.createAlarm(new AlarmTime(10, 0)));
        const result = list.addAlarm(Alarm.createAlarm(new AlarmTime(10, 0)));

        expect(result.ok).toBe(false);
    });

});



describe("--------------------ロジック層「AlarmDataManager」--------------------", () => {
    test("No.5 成功時: DataManagerに保存処理が呼ばれる", () => {
        // 部分的に必要な関数だけ使用する
        const mockDataManager: Partial<AlarmDataManager> = {
            saveAll: vi.fn(),
        };

        const service = new ManagerService(new AlarmList(), mockDataManager as AlarmDataManager);

        const result = service.saveAlarm(new AlarmTime(10, 0));

        // expect(result.ok).toBe(true);
        expect(mockDataManager.saveAll).toHaveBeenCalled();
    });

    test("No.6 失敗時: DataManagerに保存処理は呼ばれない", () => {
        const mockDataManager: Partial<AlarmDataManager> = {
            saveAll: vi.fn(),
        };

        const list = new AlarmList();

        // 重複させる
        list.addAlarm(Alarm.createAlarm(new AlarmTime(10, 0)));

        const service = new ManagerService(list, mockDataManager as AlarmDataManager);

        const result = service.saveAlarm(new AlarmTime(10, 0));

        expect(result.ok).toBe(false);
        // 「not」= 呼ばれてないことを確認する
        expect(mockDataManager.saveAll).not.toHaveBeenCalled();
    });

});


// 最後らへんにMock共通化

// 永続化
// ・起動時
// ・保存後にloadで復元できる
// 現状、他には？？？？？？？？？
// 「キャンセルボタン」押下
// 時間・分の入力ができる

// 各ボタン状態での押下できるボタン「ボタンルール」

// 状態系
// ・初期状態はON
// ・toggleでON/OFF切替