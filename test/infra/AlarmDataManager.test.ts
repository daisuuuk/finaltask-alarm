
import { describe, test, expect, vi, beforeEach } from "vitest";
import { ManagerService } from '../../src/service/ManagerService';
import { AlarmDataManager } from '../../src/infra/AlarmDataManager';
import { Alarm } from '../../src/domain/alarm/Alarm';
import { AlarmList } from '../../src/domain/alarm/AlarmList';
import { AlarmTime } from '../../src/domain/alarm/AlarmTime';


describe("--------------------ロジック層「AlarmDataManager」--------------------", () => {
    test("No.5 成功時: DataManagerに正しいデータで保存処理が呼ばれる", () => {
        const saveAllMock = vi.fn<(alarms: Alarm[]) => void>();
        // 部分的に必要な関数だけ使用する
        const mockDataManager: Partial<AlarmDataManager> = {
            saveAll: saveAllMock,
        };

        const service = new ManagerService(new AlarmList(), mockDataManager as AlarmDataManager);

        const result = service.saveAlarm(new AlarmTime(10, 0));

        const savedData = saveAllMock.mock.calls[0][0];

        // 呼ばれたか
        expect(result.ok).toBe(true);
        expect(mockDataManager.saveAll).toHaveBeenCalled();
        // 呼ばれた回数と中身
        expect(savedData.length).toBe(1);
        expect(savedData[0].getTime().getHour()).toBe(10);
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

    test("No. 異常系: OFF状態でstartRingingしても鳴らない(= OFFなのに鳴る のはダメなので確認している)", () => {
        const alarm = Alarm.createAlarm(new AlarmTime(10, 0));
        alarm.toggleOnOff();

        alarm.startRinging();

        expect(alarm.isRinging()).toBe(false);
    });

});