
// 「vi.fn()」 = 偽物の関数 → 呼ばれたかどうかだけ確認

// ----------------------------

import { describe, test, expect, vi } from "vitest";
import { AlarmDisplayController, type IManagerService, type IExecutionService, Result, AlarmViolationType } from '../../src/controller/AlarmDisplayController';
import { getButtonCount } from "../../src/domain/alarm/AlarmCount";
import { DisplayGroup } from "../../src/display/DisplayGroup";
import { AlarmTime } from '../../src/domain/alarm/AlarmTime';
import { Alarm } from "../../src/domain/alarm/Alarm";

// 「AlarmDisplayController」のダミーを作成
// デフォルト値は定義不要
function createUI(): AlarmDisplayController {
    const mockDisplay = {
        list: { renderList: vi.fn() },
        add: { renderAdd: vi.fn(), renderClose: vi.fn() },
        edit: { renderEdit: vi.fn(), renderClose: vi.fn() },
        rule: { renderRule: vi.fn() },
        modal: { renderOpenAlertModal: vi.fn(), renderCloseAlertModal: vi.fn() },
    } satisfies DisplayGroup;

    const mockManagerService = createMockService({
        getAlarms: vi.fn(() => []),
        canAddAlarm: vi.fn(() => true)
    });

    const mockExecutionService = {} as IExecutionService;

    return new AlarmDisplayController(
        mockDisplay,
        mockManagerService,
        mockExecutionService,
    );
}
// ヘルパー関数
// 「デフォルトセット ＋ 必要な部分だけ変更」
function createMockService(
    overrides: Partial<IManagerService>
): IManagerService {
    return {
        getAlarms: vi.fn(() => []),
        saveAlarm: vi.fn(),
        editAlarm: vi.fn(),
        findById: vi.fn(),
        initialLoad: vi.fn(),
        deleteMany: vi.fn(),
        canAddAlarm: vi.fn(),
        toggleAlarm: vi.fn(),
        onAlarmRemoved: vi.fn(),
        ...overrides
    };
}

// 呼び出しだけチェック
describe("--------------------UI層--------------------", () => {
    test("No.1 正常: アラーム追加画面を表示できる", () => {
        const mockDisplay = {
            list: { renderList: vi.fn() },
            add: { renderAdd: vi.fn(), renderClose: vi.fn() },
            edit: { renderEdit: vi.fn(), renderClose: vi.fn() },
            rule: { renderRule: vi.fn() },
            modal: { renderOpenAlertModal: vi.fn(), renderCloseAlertModal: vi.fn() },
        } satisfies DisplayGroup;

        const mockManagerService = createMockService({
            canAddAlarm: vi.fn(() => true),
        });

        const ui = new AlarmDisplayController(
            mockDisplay,
            mockManagerService,
            {} as IExecutionService
        );

        ui.openAddModal();

        expect(mockDisplay.add.renderAdd).toHaveBeenCalled();
    });

    test("No.  異常：アラーム追加不可の場合は表示されない", () => {
        const mockDisplay = {
            list: { renderList: vi.fn() },
            add: { renderAdd: vi.fn(), renderClose: vi.fn() },
            edit: { renderEdit: vi.fn(), renderClose: vi.fn() },
            rule: { renderRule: vi.fn() },
            modal: { renderOpenAlertModal: vi.fn(), renderCloseAlertModal: vi.fn() },
        } satisfies DisplayGroup;

        const mockManagerService = createMockService({
            canAddAlarm: vi.fn(() => false),
        });

        const ui = new AlarmDisplayController(
            mockDisplay,
            mockManagerService,
            {} as IExecutionService
        );

        ui.openAddModal();

        expect(mockDisplay.add.renderAdd).not.toHaveBeenCalled();
    });

    test("No. キャンセルボタン押下で閉じる", () => {
        const mockDisplay = {
            list: { renderList: vi.fn() },
            add: { renderAdd: vi.fn(), renderClose: vi.fn() },
            edit: { renderEdit: vi.fn(), renderClose: vi.fn() },
            rule: { renderRule: vi.fn() },
            modal: { renderOpenAlertModal: vi.fn(), renderCloseAlertModal: vi.fn() },
        } satisfies DisplayGroup;

        // createMockService の全てのメソッドがデフォルトで入る
        const mockService = createMockService({});
        const ui = new AlarmDisplayController(
            mockDisplay,
            mockService,
            {} as IExecutionService
        );

        ui.hideModal();

        expect(mockDisplay.add.renderClose).toHaveBeenCalled();
    });

    test("No. 正常: 「保存ボタン」押下で一覧表示される", () => {
        const mockDisplay = {
            list: { renderList: vi.fn() },
            add: { renderAdd: vi.fn(), renderClose: vi.fn() },
            edit: { renderEdit: vi.fn(), renderClose: vi.fn() },
            rule: { renderRule: vi.fn() },
            modal: { renderOpenAlertModal: vi.fn(), renderCloseAlertModal: vi.fn() },
        } satisfies DisplayGroup;

        const mockExecutionService: IExecutionService = {
            stopAlarm: vi.fn(),
            startAlarmMonitoring: vi.fn(),
            stopAlarmMonitoring: vi.fn(),
            timeReached: vi.fn(),
        };

        const alarm = Alarm.createAlarm(new AlarmTime(10, 30));

        // createMockService の全てのメソッドがデフォルトで入る
        const mockService = createMockService({
            saveAlarm: vi.fn().mockReturnValue({
                ok: true,
                value: alarm,
            })
        });

        const ui = new AlarmDisplayController(
            mockDisplay,
            mockService,
            // {} as IExecutionService
            // startAlarmMonitoringを呼ぶ必要がある為
            mockExecutionService,
        );

        const mockTime = {
            getHour: () => 10,
            getMinute: () => 30,
            equals: (other: unknown) => false
        } as AlarmTime;

        ui["updateUi"]();
        ui["handleSaveButton"](mockTime);

        expect(mockDisplay.list.renderList).toHaveBeenCalled();
    });

    test("No. 異常: 「保存ボタン」押下時の重複時はルール表示される 必要！！！！！", () => {

    });

    test("No. 正常: 行選択トグル", () => {
        const ui = createUI();

        ui["onRowClicked"]("1");
        expect(ui.isSelected("1")).toBe(true);

        ui["onRowClicked"]("1");
        expect(ui.isSelected("1")).toBe(false);
    });

    test("No.  正常: アラーム未選択状態では、削除ボタンは無効化", () => {
        const state = getButtonCount({
            alarmsCount: 3,
            selectedCount: 0
        });

        expect(state.canDelete).toBe(false);
    });

    test("No.  アラーム未選択状態では、編集ボタンは無効化", () => {
        // const state = getButtonCount({
        //     alarmsCount: 3,
        //     selectedCount: 0
        // });

        // expect(state.canDelete).toBe(false);
    });

    test("No.  アラーム選択2件以上では、編集ボタンは無効化", () => {
        // const state = getButtonCount({
        //     alarmsCount: 3,
        //     selectedCount: 0
        // });

        // expect(state.canDelete).toBe(false);
    });

    test("No.  アラーム未選択状態では、解除ボタンは無効化", () => {
        // const state = getButtonCount({
        //     alarmsCount: 3,
        //     selectedCount: 0
        // });

        // expect(state.canDelete).toBe(false);
    });

});

// 最後らへんにMock共通化