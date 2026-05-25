
import { Alarm } from "../domain/Alarm";
import { type IAddDisplay, type IDisplay, type IListDisplay, type IRuleDisplay, type IEditDisplay, type IModalDisplay } from "./IDisplay";
import { TimeFormatter } from "../common/TimeFormatter";
import { ModalService } from "../domain/ModalService";

export class DomDisplay implements IDisplay {
    private formatter: TimeFormatter;

    constructor(formatter: TimeFormatter) {
        this.formatter = formatter;
    }

    renderInitial(): void { }
    // { this.content.innerHTML = "<p>アラームはまだありません</p>"; }
    renderMissedAlarm(): void { }
}

export class EditDisplay implements IEditDisplay {
    constructor(private modal: ModalService) { }

    renderEdit(alarm: Alarm): void {
        const hour = document.getElementById("alarm-hour") as HTMLSelectElement;
        const minute = document.getElementById("alarm-minute") as HTMLSelectElement;

        if (!hour || !minute) {
            return;
        }

        // ここがADDとの違い（初期値セット）
        hour.value = String(alarm.getTime().getHour()).padStart(2, "0");
        minute.value = String(alarm.getTime().getMinute()).padStart(2, "0");

        console.log(
            [...hour.options].map(o => o.value)
        );
        console.log(minute.value);

        this.modal.showModalView();
    }

    renderClose(): void {
        this.modal.hideModalView();
    }
}

export class AddDisplay implements IAddDisplay {
    constructor(private modal: ModalService) { }
    /**
     * 「アラーム追加画面」という表示のみの役割
     * @param alarm 
     * @returns 
     */
    // ③ 追加画面を描画
    // renderAdd(onSave: () => void): void {
    renderAdd(): void {
        const hour = document.getElementById("alarm-hour") as HTMLSelectElement;
        const minute = document.getElementById("alarm-minute") as HTMLSelectElement;

        if (!hour || !minute) {
            return;
        }

        hour.selectedIndex = 0;
        minute.selectedIndex = 0;

        this.modal.showModalView();
    }

    renderClose(): void {
        this.modal.hideModalView();
    }
}

export class RuleDisplay implements IRuleDisplay {
    /**
     * 「アラーム同時刻設定不可メッセージ」表示の役割
     * @param message 
     * @returns 
     */
    renderRule(message: string): void {
        console.log("renderRule呼ばれた");
        const element = document.getElementById("alarm-rule-message");
        if (!element) {
            return;
        }

        element.textContent = message;
        element.classList.remove("hidden");
    }
}

export class ListDisplay implements IListDisplay {
    renderList(alarms: Alarm[], selectedIds: Set<string>): void {
        // ①HTMLから要素を取得
        const listSection = document.getElementById("alarm-list-section");
        const list = document.getElementById("alarm-list");

        // ②ガード　なければ早期リターン
        if (!listSection || !list) {
            return;
        }

        if (alarms.length === 0) {
            listSection.classList.add("hidden");
            return;
        }

        // ③ 一覧(小タイトル・各ボタン)を表示
        listSection.classList.remove("hidden");

        // ④ フォーマッタ使用
        const formatter = new TimeFormatter();

        // ⑤ul(リスト)の内容 を表示する為に全てのアラームをループして処理する
        const html = alarms.map(alarm => {
            const id = alarm.getId();

            const selected = selectedIds.has(id) ? "selected" : "";
            // const check = alarm.isActive() ? "checked" : "";
            const active = alarm.isActive() ? "active" : "";
            // ❶アラームの時間・分を取得する
            const time = alarm.getTime();
            // ❷それを"HH:MM" 形式にする
            const text = formatter.formatHourMinute(time);
            // ❸それらをアラーム１行に表示する書き方
            // <li class="alarm-item ${alarm.isSelected() ? "selected" : ""}" data-id="${alarm.getId()}">
            return `
            <li class="alarm-item ${selected}" data-id="${alarm.getId()}"> 
                <span>${text}</span> 
                <button class="alarm-toggle-btn ${active}"></button> 
            </li>
        `;
        }).join("");

        list.innerHTML = html;
    }
}

export class ModalDisplay implements IModalDisplay {
    // DOMは一度作ると「どこにも参照がない」と削除できないため定義する
    private modalElement: HTMLElement | null = null;

    renderOpenAlertModal(props: { title: string; onStop: () => void }): void {
        // 既存があれば閉じる
        this.renderCloseAlertModal();

        // オーバーレイ（背景の暗い部分）
        const overlay = document.createElement("div");
        overlay.className = "alarm-alert-modal-overlay";

        const modal = document.createElement("div");
        modal.className = "alarm-alert-modal";

        const title = document.createElement("p");
        title.className = "alarm-alert-modal-title";
        title.textContent = props.title;

        const button = document.createElement("button");
        button.className = "alarm-alert-modal-stop-btn";
        button.textContent = "停止";
        button.onclick = () => {
            props.onStop();
            this.renderCloseAlertModal();
        };

        modal.appendChild(title);
        modal.appendChild(button);
        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        this.modalElement = overlay; // overlayごと保存(親ごとまとめて持つ)
    }

    renderCloseAlertModal(): void {
        // DOM削除
        if (this.modalElement) {
            this.modalElement.remove();
            this.modalElement = null;
        }
    }
}