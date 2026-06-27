
import { DisplayGroup } from "../display/DisplayGroup";
import { type ButtonType, Buttons } from "../domain/alarm/ButtonType";
import { Alarm } from "../domain/alarm/Alarm";
import { Button } from "../common/Button";
import { getButtonCount } from "../domain/alarm/AlarmCount";
import { SetUpEventBinder } from "./binder/SetUpEventBinder";
import { TimeFactory } from "./factory/TimeSelectFactory";
import { AlarmTime } from "../domain/alarm/AlarmTime";
import { DuplicateAlarmTimeViolation } from "../violation/DuplicateAlarmTimeViolation";
import { AlarmLimitExceededViolation } from "../violation/AlarmLimitExceededViolation";
import { type TimeReachedListener } from "../service/ExecutionService";
import { type AlarmRemovedListener } from "../service/ManagerService";

// type Result =
//     | { ok: true; value: undefined }
//     | { ok: false; error: AlarmLimitExceededError }
//     | { ok: false; error: DuplicateAlarmTimeError };
// ⇩⇩ ジェネリクス化
export type Result<T, E> =
    | { ok: true; value: T }
    | { ok: false; error: E };

export type AlarmViolationType =
    | AlarmLimitExceededViolation
    | DuplicateAlarmTimeViolation

export type AlarmCount = {
    alarmsCount: number;
    selectedCount: number;
};

// 追加時と編集時で「保存ボタン」後の処理を分けるために必要
type Mode = "add" | "edit";

export interface IManagerService {
    saveAlarm(time: AlarmTime): Result<void, AlarmViolationType>;
    editAlarm(id: string, time: AlarmTime): Result<void, AlarmViolationType>;
    getAlarms(): Alarm[];
    findById(id: string): Alarm | undefined;
    initialLoad(): void;
    canAddAlarm(): boolean;
    toggleAlarm(id: string): void;
    deleteMany(ids: string[]): void;
    onAlarmRemoved(listener: AlarmRemovedListener): void;
}

export interface IExecutionService {
    stopAlarm(): void;
    startAlarmMonitoring(alarm: Alarm): void;
    stopAlarmMonitoring(id: string): void;
    timeReached(listener: TimeReachedListener): void;
    // handleTimeReached(alarm: Alarm): void;
}

export class AlarmDisplayController {
    private buttons = new Map<ButtonType, Button>();
    private selectedIds = new Set<string>();
    private mode: Mode = "add";
    private editingId: string | null = null;

    constructor(
        private display: DisplayGroup,
        private managerService: IManagerService,
        private executionService: IExecutionService,
        // private setListener(() => this.onTimeReached()),
        private binder: SetUpEventBinder = new SetUpEventBinder(),
        private timeFactory: TimeFactory = new TimeFactory(),
    ) { }

    /**
     * 起動時処理 = 通知はUIがするので、「ボタン押下後処理も起動」もUIで行うため
     */
    // そもそもinit()をクラス化し、main.tsで呼ぶ設計にする？？？？？？
    public init(): void {
        this.setupCallBack();
        this.setupAlarmListEvent();
        this.setupModalEvent();
        this.createAlarmTimeSelect();

        this.managerService.initialLoad();

        // 再描画(ローカルストレージのデータとも照合的な)
        this.updateUi();
    }

    // コールバックの流れザックリ ⑧listenerが呼ばれ時間到達処理
    private setupCallBack(): void {
        // 鳴動時のコールバック
        // Alarmの複数プロパティを使う為、Alarm
        this.executionService.timeReached((alarm) => {
            this.onTimeReached(alarm);
        });

        // アラーム削除時のコールバック
        // IDだけ使う為、id
        // 「(id) => stopAlarmMonitoring(id)」という関数を持って,
        // ❶managerService に onAlarmRemoved を渡す。
        this.managerService.onAlarmRemoved((id) => {
            this.executionService.stopAlarmMonitoring(id);
        });
    }

    /**
     * コールバック用
     */
    // コールバックの流れザックリ ⑨実際の処理 モーダル表示
    private onTimeReached(alarm: Alarm): void {
        const time = alarm.getTime();
        this.display.modal.renderOpenAlertModal({
            title: `アラーム (${time.hour}:${String(time.minute).padStart(2, "0")})`,
            onStop: () => this.executionService.stopAlarm(),
        });
    }

    // コールバックの流れザックリ ②アラーム監視開始
    private onToggleChanged(alarm: Alarm, isOn: boolean): void {
        if (isOn) {
            this.executionService.startAlarmMonitoring(alarm);
        } else {
            this.executionService.stopAlarmMonitoring(alarm.getId());
        }
    }

    // コールバックの流れザックリ ①トグルON
    private onToggleClicked(id: string, isOn: boolean): void {
        // console.log("before",
        //     this.managerService.getAlarms().map(alarm => ({
        //         id: alarm.getId(),
        //         active: alarm.isActive()
        //     }))
        // );
        const alarm = this.managerService.findById(id);
        if (!alarm) { 
            return;
        }

        this.managerService.toggleAlarm(id);

        this.onToggleChanged(alarm, isOn);

        // console.log("after",
        //     this.managerService.getAlarms().map(alarm => ({
        //         id: alarm.getId(),
        //         active: alarm.isActive()
        //     }))
        // );

        this.updateUi();
    }

    private setupAlarmListEvent(): void {
        console.log("setupAlarmListEvent called!");
        this.binder.bindList(
            document,
            // (id) => this.onToggleClicked(id),
            (id, isOn) => this.onToggleClicked(id, isOn),
            // js切替ではなくcss切替？
            // (id, isOn) => this.onToggleChangedById(id, isOn),
            (id) => this.onRowClicked(id)
        );
    }

    private setupModalEvent(): void {
        const overlay = document.getElementById("alarm-modal-overlay");
        const saveBtn = document.getElementById("SAVE");
        const cancelBtn = document.getElementById("CANCEL");

        if (!overlay || !saveBtn || !cancelBtn) {
            return;
        }

        this.binder.bindModal(
            overlay,
            saveBtn,
            cancelBtn,
            () => this.onButtonClicked("SAVE"),
            () => this.hideModal(),
        );
    }

    public hideModal(): void {
        this.display.add.renderClose();
    }

    private createAlarmTimeSelect(): void {
        const hourSelect = document.getElementById("alarm-hour") as HTMLSelectElement;
        const minuteSelect = document.getElementById("alarm-minute") as HTMLSelectElement;

        if (!hourSelect || !minuteSelect) {
            return;
        }

        const hours = this.timeFactory.createOptions(24);
        const minutes = this.timeFactory.createOptions(60);

        hours.forEach(o => hourSelect.appendChild(o));
        minutes.forEach(o => minuteSelect.appendChild(o));
    }

    /**
     * クリック処理を登録する(紐づける)メソッド
     * @param button 
     * @param type 
     * @remarks
     * - a
     * - b
     */
    private bind(type: ButtonType, button: Button) {
        button.setOnClick(() => this.onButtonClicked(type));
    }

    public registerButton(type: ButtonType, button: Button): void {
        if (this.buttons.has(type)) {
            return;
        }

        this.buttons.set(type, button);
        this.bind(type, button);
    }

    public openAddModal(): void {
        console.log("ADD押された");
        // UI側でグレーアウトで押下できないようにはしている(制御)ので「boolean」で判別。問題なければrenderで表示
        const canAdd = this.managerService.canAddAlarm();

        if (!canAdd) {
            // そもそも押下できないので通知する系は無しで結果を返すだけにする「return」など？
            return;
        }

        this.mode = "add";
        this.editingId = null;

        this.display.add.renderAdd();
    }

    private handleSaveButton(time: AlarmTime): void {
        if (this.mode === "add") {
            const success = this.handleAddCase(time);
            if (!success) { 
                return;
            }
        }

        if (this.mode === "edit" && this.editingId) {
            const success = this.handleEditCase(time);
            if (!success) { 
                return;
            }
        }

        this.updateUi();
    }

    private handleAddCase(time: AlarmTime): boolean {
        // ②取得したものを保存する処理へ
        const result = this.managerService.saveAlarm(time);
        // Serviceから「保存できなったという結果」が返ってきた場合の処理
        if (result.ok === false) {
            if (result.error instanceof DuplicateAlarmTimeViolation) {
                this.display.rule.renderRule(result.error.message);
                alert("同時刻は設定できません！！！");
            }
            return false;
        }

        return true;
    }

    private handleEditCase(time: AlarmTime): boolean {
        if (!this.editingId) {
            return false;
        }
        // idと時間・分を取得し、メソッドを呼ぶ
        const result = this.managerService.editAlarm(this.editingId, time);

        if (result.ok === false) {
            if (result.error instanceof DuplicateAlarmTimeViolation) {
                this.display.rule.renderRule(result.error.message);
            }
            return false;
        }
        // AlarmLimitExceededViolation はUIで表示しない⇩
        return true;
    }

    // ボタン系はswitch⇩⇩
    private onButtonClicked(type: ButtonType): void {
        // 共通の定数
        // ① UI：選択中のIDを取得
        // const ids = this.getSelectedIds();
        // ② UI：入力された時間・分を取得
        // const times = this.getSelectedTime();

        switch (type) {
            case Buttons.ADD:
                this.openAddModal();
                break;

            case Buttons.EDIT:
                console.log("EDIT押された");
                const id = this.getSelectedId();
                const alarm = this.managerService.findById(id);

                if (!alarm) {
                    return;
                }

                this.mode = "edit";
                this.editingId = id;

                this.display.edit.renderEdit(alarm);

                break;

            case Buttons.SAVE:
                console.log("SAVE押された");

                // ①「時間・分」の入力を取得
                const time = this.getSelectedTime();
                this.handleSaveButton(time);

                console.log("リストで表示");

                break;

            case Buttons.DELETE:
                const ids = this.getSelectedIds();
                const result = this.managerService.deleteMany(ids);

                this.selectedIds.clear();

                this.updateUi();
                break;

            // 選択解除
            case Buttons.CLEAR:
                this.clearSelection();
                this.updateUi();
                break;
        }
    }

    // 行クリックはメソッド⇩⇩
    /**
     * 行クリック(すでに選択されていれば解除、されていなければ追加する)
     * @param id 
     */
    private onRowClicked(id: string): void {
        console.log("=== onRowClicked ===", id);

        if (this.isSelected(id)) {
            this.selectedIds.delete(id);
        } else {
            this.selectedIds.add(id);
        }

        // console.log(`${this.selectedIds}`);

        this.updateUi();

        // console.log("alarmsCount", this.managerService.getAlarms().length);
        // console.log("selectedCount", this.selectedIds.size);
        // console.log(this.buttons);
    }

    public isSelected(id: string): boolean {
        return this.selectedIds.has(id);
    }

    /**
     * 選択解除
     */
    clearSelection(): void {
        this.selectedIds.clear();
    }

    private getSelectedId(): string {
        if (this.selectedIds.size !== 1) {
            throw new Error("編集は1件のみ選択してください");
        }

        return [...this.selectedIds][0];
    }

    private getSelectedIds(): string[] {
        return [...this.selectedIds];
    }

    /**
     * ユーザー操作で選択された「時間・分」を取得する関数
     * @returns 
     */
    private getSelectedTime(): AlarmTime {
        const hourInput = document.getElementById("alarm-hour") as HTMLInputElement;
        const minuteInput = document.getElementById("alarm-minute") as HTMLInputElement;

        const hour = Number(hourInput.value);
        const minute = Number(minuteInput.value);
        console.log(`時間：${hour}　分${minute}`);
        return this.timeFactory.createAlarmTimeSelect(hour, minute);
    }

    /**
     * UIを更新する関数(=再描画)
     */
    private updateUi(): void {
        const alarms = this.managerService.getAlarms();

        this.display.list.renderList(alarms, this.selectedIds);
        this.updateButtonState();
    }

    /**
     * アラーム数を引数(uiCount)に、どのボタンが押下できる状態か(getButtonCount)を定義し、
     * 各ボタン押下のUI状態を管理する(グレーアウトで制御)
     */
    private updateButtonState(): void {
        // const uiState: UIState = {
        //     // アラーム設定数
        //     alarmsCount: this.service.getAlarms().length,
        //     // アラーム選択数
        //     selectedCount: this.service.getSelectedCount(),
        // };

        // const state = getButtonState(uiState);
        // // 「アラームを追加+」を押下できる
        // state.canAdd ? this.buttons.ADD.enabled() : this.buttons.ADD.disabled();
        // // 「編集ボタン」を押下できる
        // state.canEdit ? editBtn.enabled() : editBtn.disabled();
        // // 「削除ボタン」を押下できる
        // state.canDelete ? deleteBtn.enabled() : deleteBtn.disabled();
        // // 「キャンセルボタン」？を押下できる
        // state.canClear ? clearBtn.enabled() : clearBtn.disabled();

        // -----

        const uiCount: AlarmCount = {
            // アラーム設定数
            alarmsCount: this.managerService.getAlarms().length,
            // アラーム選択数
            selectedCount: this.selectedIds.size,
        };

        // アラーム数を引数(uiCount)に、どのボタンが押下できる状態か(getButtonCount)をconstで定義
        const state = getButtonCount(uiCount);

        // 「アラームを追加+」を押下できる
        this.toggleButtonState(this.buttons.get("ADD"), state.canAdd);
        // console.log("アラームを追加できます")
        // this.toggle(this.buttons.get("SAVE"), state.canSave);
        // 「編集ボタン」を押下できる
        this.toggleButtonState(this.buttons.get("EDIT"), state.canEdit);
        // 「削除ボタン」を押下できる
        this.toggleButtonState(this.buttons.get("DELETE"), state.canDelete);
        // 「一括解除ボタン」？を押下できる
        this.toggleButtonState(this.buttons.get("CLEAR"), state.canClear);
    }

    private toggleButtonState(button: Button | undefined, enabled: boolean): void {
        if (!button) {
            return;
        }

        enabled ? button.enable() : button.disable();
    }

}