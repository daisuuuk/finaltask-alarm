
import { type IAddDisplay, type IListDisplay, type IRuleDisplay, type IEditDisplay } from "../display/IDisplay";
import { type ButtonType, Buttons } from "../domain/ButtonType";
import { Button } from "../common/Button";
import { getButtonCount } from "../domain/AlarmCount";
import { ManagerService } from "../service/ManagerService";
import { ExecutionService } from "../service/ExecutionService";
import { AlarmTime } from "../domain/AlarmTime";
import { DuplicateAlarmTimeViolation } from "../violation/DuplicateAlarmTimeViolation";
import { AlarmLimitExceededViolation } from "../violation/AlarmLimitExceededViolation";

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
    | DuplicateAlarmTimeViolation;

export type AlarmCount = {
    alarmsCount: number;
    selectedCount: number;
};

// 追加時と編集時で「保存ボタン」後の処理を分けるために必要
type Mode = "add" | "edit";

type ManagerServiceOne = Pick<
    ManagerService,
    "saveAlarm" | "getAlarms"
>;

type ManagerServiceTwo = Pick<
    ManagerService,
    "initialLoad" | "canAddAlarm" | "toggleAlarm" | "editAlarm" | "findById" | "deleteMany"
>;

type ExecutionServiceOne = Pick<
    ExecutionService,
    "stopAlarm"
>;

export class AlarmDisplayController {
    private buttons = new Map<ButtonType, Button>();
    private selectedIds = new Set<string>();
    private mode: Mode = "add";
    private editingId: string | null = null;

    constructor(
        private editDisplay: IEditDisplay,
        private addDisplay: IAddDisplay,
        private listDisplay: IListDisplay,
        private ruleDisplay: IRuleDisplay,
        private managerService: ManagerServiceOne & ManagerServiceTwo,
        private executionService: ExecutionServiceOne,
        // private setListener(() => this.onTimeReached()),
    ) { }

    /**
     * コールバック用
     */
    private onTimeReached() {
        // this.display.renderAlertDialog(alarm: Alarm): void
    }

    /**
     * どこに行くか決める役割
     */
    // private onTimerButtonClicked(): void {
        // this.navigator.switchTo(Screen.TIMER);
    // }

    /**
     * 起動時処理 = 通知はUIがするので、「ボタン押下後処理も起動」もUIで行うため
     */
    // そもそもinit()をクラス化し、main.tsで呼ぶ設計にする？？？？？？
    public init(): void {
        this.setupAlarmListEvent();
        this.setupModalEvent();
        this.createAlarmTimeSelect();

        this.managerService.initialLoad();

        // 再描画(ローカルストレージのデータとも照合的な)
        this.updateUi();
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

    public registerButton(type: ButtonType, button: Button) {
        if (this.buttons.has(type)) {
            return;
        }

        this.buttons.set(type, button);
        this.bind(type, button);
    }

    private setupModalEvent(): void {
        const overlay = document.getElementById("modalOverlay");
        const saveBtn = document.getElementById("SAVE");
        const cancelBtn = document.getElementById("CANCEL");

        if (!overlay || !saveBtn || !cancelBtn) {
            return;
        }

        saveBtn.addEventListener("click", () => {
            this.onButtonClicked("SAVE");
            overlay.classList.add("hidden");
        });

        cancelBtn.addEventListener("click", () => {
            overlay.classList.add("hidden");
        });
    }

    /**
     * アラーム追加時の「時間・分」のセレクト生成
     */
    private createAlarmTimeSelect(): void {
        const hourSelect = document.getElementById("hour") as HTMLSelectElement;
        const minuteSelect = document.getElementById("minute") as HTMLSelectElement;

        // 0〜23
        for (let i = 0; i < 24; i++) {
            // const option = document.createElement("option");
            // option.value = String(i);
            // option.text = i.toString().padStart(2, "0");
            // ２桁統一 "07"と"7"など
            const val = String(i).padStart(2, "0");
            const option = document.createElement("option");
            option.value = val;
            option.textContent = val;

            hourSelect.appendChild(option);
        }

        // 0〜59
        for (let i = 0; i < 60; i++) {
            const val = String(i).padStart(2, "0"); 
            const option = document.createElement("option");
            option.value = val;
            option.textContent = val;
            minuteSelect.appendChild(option);
        }
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
                console.log("ADD押された");
                // UI側でグレーアウトで押下できないようにはしている(制御)ので「boolean」で判別。問題なければrenderで表示
                const canAdd = this.managerService.canAddAlarm();
                // ここは念の為
                if (canAdd === false) {
                    // そもそも押下できないので通知する系は無しで結果を返すだけにする「return」など？
                    alert("これ以上追加できません！！！");
                    return;
                }

                this.mode = "add";
                this.editingId = null;

                // コールバック　理由：①Display（表示）とUI（制御）が密結合になる、②Display が UIを直接呼ぶという依存関係が逆を防げる
                // ① UIがrenderAddを呼ぶ
                this.addDisplay.renderAdd();
                // this.addDisplay.renderAdd(() => {
                //     // ② 引数に「関数」を渡す
                //     // ⑦ onButtonClicked(SAVE)が呼ばれる
                //     this.onButtonClicked(Buttons.SAVE);
                // });
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

                // this.editDisplay.renderEdit(alarm, () => {
                //     this.onButtonClicked(Buttons.SAVE);
                // });
                this.editDisplay.renderEdit(alarm);

                break;

            case Buttons.SAVE:
                console.log("SAVE押された");
                // const alarm = new Alarm(this.getSelectedTime());
                // ①「時間・分」の入力を取得
                const time = this.getSelectedTime();
                if (this.mode === "add") {
                    // ②取得したものを保存する処理へ
                    const result = this.managerService.saveAlarm(time);

                    // Serviceから「保存できなったという結果」が返ってきた場合の処理
                    if (result.ok === false) {
                        if (result.error instanceof DuplicateAlarmTimeViolation) {
                            // this.display.renderRule(result.error.message);
                            this.ruleDisplay.renderRule(result.error.message);
                            alert("同時刻は設定できません！！！");
                        }

                        // AlarmLimitExceededViolation はUIで表示しない⇩
                        return;
                    }
                } else if (this.mode === "edit" && this.editingId) {
                    // idと時間・分を取得し、メソッドを呼ぶ
                    const result = this.managerService.editAlarm(this.editingId, time);

                    if (result.ok === false) {
                        if (result.error instanceof DuplicateAlarmTimeViolation) {
                            this.ruleDisplay.renderRule(result.error.message);
                        }
                    }
                }

                // this.ruleDisplay.clearRule();
                // ③成功時の処理 = アラーム一覧に表示
                this.updateUi();
                console.log("リストで表示");

                break;

            case Buttons.DELETE:
                const ids = this.getSelectedIds();
                this.managerService.deleteMany(ids);

                this.selectedIds.clear();

                this.updateUi();
                break;
            // case Buttons.TOGGLE:
            //     if (ids.length !== 1) {
            //         return;
            //     }

            //     this.service.toggle(ids[0]);
            //     break;

            // 選択解除
            case Buttons.CLEAR:
                this.clearSelection();
                this.updateUi();
                break;
        }
    }

    // 下記3つ画面系はメソッド⇩⇩
    /**
     * 「閉じる」ボタン押下 「UI操作」
     */
    private onClickClose(): void {
        this.hideModal();
    }

    /**
     * 「キャンセル」ボタン押下 「UI操作+少しロジック操作」
     */
    private onClickCancel(): void {
        console.log("CLEAR_SELECTION押された");
        this.clearSelection();
    }

    /**
     * 「停止」ボタン押下 「ロジック操作」
     */
    private onClickStop(): void {
        this.executionService.stopAlarm();
    }

    // ----------アラーム選択系

    // 行クリックはメソッド⇩⇩
    /**
     * 行クリック(すでに選択されていれば解除、されていなければ追加する)
     * @param id 
     */
    private onRowClicked(id: string): void {
        if (this.selectedIds.has(id)) {
            this.selectedIds.delete(id);
        } else {
            this.selectedIds.add(id);
        }

        console.log(`${this.selectedIds}`);

        this.updateUi();

        console.log("alarmsCount", this.managerService.getAlarms().length);
        console.log("selectedCount", this.selectedIds.size);
        console.log(this.buttons);
    }

    /**
     * 
     * @param id 
     */
    private onToggleClicked(id: string): void {
        console.log("before",
            this.managerService.getAlarms().map(alarm => ({
                id: alarm.getId(),
                active: alarm.isActive()
            }))
        );

        this.managerService.toggleAlarm(id);

        console.log("after",
            this.managerService.getAlarms().map(alarm => ({
                id: alarm.getId(),
                active: alarm.isActive()
            }))
        );

        this.updateUi();
    }

    /**
     * 選択されているかどうかの判定
     * @param id 
     * @returns 
     */
    private isSelected(id: string): boolean {
        return this.selectedIds.has(id);
    }

    /**
     * 選択解除
     */
    clearSelection(): void {
        this.selectedIds.clear();
    }

    /**
     * UIを更新する関数(=再描画)
     */
    private updateUi(): void {
        const alarms = this.managerService.getAlarms();

        this.listDisplay.renderList(alarms, this.selectedIds);
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
        console.log("アラームを追加できます")
        // this.toggle(this.buttons.get("SAVE"), state.canSave);
        // 「編集ボタン」を押下できる
        this.toggleButtonState(this.buttons.get("EDIT"), state.canEdit);
        // 「削除ボタン」を押下できる
        this.toggleButtonState(this.buttons.get("DELETE"), state.canDelete);
        // 「一括解除ボタン」？を押下できる
        this.toggleButtonState(this.buttons.get("CLEAR"), state.canClear);
    }

    // DI
    private toggleButtonState(button: Button | undefined, enabled: boolean): void {
        if (!button) {
            return;
        }

        enabled ? button.enable() : button.disable();
    }

    /**
     * 各ボタン押下で状態更新し、ボタン更新(グレーアウト)をする関数。→ selectedIds と同期させる
     */
    private setupAlarmListEvent() {
        // 「ON/OFF切替」と「行クリック」のイベント処理
        // イベントデリゲーション(各子要素にハンドラを登録する代わりに、共通の親要素に対してハンドラを一括して登録する仕組み)
        // const list = document.getElementById("list");

        // 「list」に限定することで、不要なイベントを防ぐ
        document.addEventListener("click", (element) => {
            const target = element.target as HTMLElement;

            // トグルボタン(ON/OFF切替)
            if (target.classList.contains("toggle-btn")) {
                // 「stopPropagation()」 = イベントが親に伝わるのを止める役割(イベントバブリングを防ぐ)
                element.stopPropagation();
                console.log("トグル");

                // target.closest() は Element | null を返す
                const item = target.closest(".alarm-item");
                if (!(item instanceof HTMLElement)) {
                    return;
                }

                // dataset は HTMLElement にしか存在しない
                const id = item.dataset.id;     // ← ここでidを取得！！！
                if (!id) {
                    return
                }

                this.onToggleClicked(id);

                return;
            }

            // 行クリック
            // 「closest」 = 自分 or 親をたどって一致する要素を探す
            const item = target.closest(".alarm-item");
            if (!(item instanceof HTMLElement)) {
                return;
            }
            if (item) {
                // item.classList.toggle("selected");
                const id = item.dataset.id;     // ← ここでidを取得！！！
                if (!id) {
                    return
                }

                this.onRowClicked(id);
            }
        });
    }

    /**
     * 選択されたアラームのID配列を取得(アラーム編集用)
     */
    // private getSelectedIds(): string {
        // 例：選択状態から取得
        // return this.service.getAll().
        // .filter(alarm => this.isSelected(alarm.id))
        // .map(alarm => alarm.id);

        // = return this.selectedIds;
    // }

    private getSelectedId(): string {
        if (this.selectedIds.size !== 1) {
            throw new Error("編集は1件のみ選択してください");
        }

        return [...this.selectedIds][0];
    }

    private getSelectedIds(): string[] {
        return [...this.selectedIds];
    }

    // ----------

    /**
     * ユーザー操作で選択された「時間・分」を取得する関数
     * @returns 
     */
    private getSelectedTime(): AlarmTime {
        const hourInput = document.getElementById("hour") as HTMLInputElement;
        const minuteInput = document.getElementById("minute") as HTMLInputElement;

        const hour = Number(hourInput.value);
        const minute = Number(minuteInput.value);
        console.log(`時間：${hour}　分${minute}`);
        return new AlarmTime(hour, minute);
    }

    /**
     * モーダルを非表示にする処理
     * @returns 
     */
    private hideModal(): void {
        const element = document.getElementById("alarm-modal");
        if (!element) {
            return;
        }

        element.classList.add("hidden");
    }

    /**
     * モーダルを表示にする処理
     * @returns 
     */
    private showModal(): void {
        const element = document.getElementById("alarm-modal");
        if (!element) {
            return;
        }

        element.classList.remove("hidden");
    }

}