
import { Alarm } from "../domain/Alarm";
import { type IAddDisplay, type IDisplay, type IListDisplay, type IRuleDisplay, type IEditDisplay } from "./IDisplay";
import { TimeFormatter } from "../common/TimeFormatter";

export class DomDisplay implements IDisplay {
    private formatter: TimeFormatter;

    constructor(formatter: TimeFormatter) {
        this.formatter = formatter;
    }

    renderInitial(): void { }
    // { this.content.innerHTML = "<p>アラームはまだありません</p>"; }

    renderAlertDialog(alarm: Alarm): void { }
    // { this.content.innerHTML = `<p>${alarm.time} のアラームです！</p>`; }
    renderMissedAlarm(): void { }
}

/**
 * AddとEditで共通
 * @returns 
 */
function showModal(): void {
    const overlay = document.getElementById("modalOverlay");
    if (!overlay) return;

    // 表示
    overlay.classList.remove("hidden");
}

export class EditDisplay implements IEditDisplay {
    renderEdit(alarm: Alarm): void {
        const hour = document.getElementById("hour") as HTMLSelectElement;
        const minute = document.getElementById("minute") as HTMLSelectElement;

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

        showModal();
    }
}

export class AddDisplay implements IAddDisplay {
    /**
     * 「アラーム追加画面」という表示のみの役割
     * @param alarm 
     * @returns 
     */
    // ③ 追加画面を描画
    // renderAdd(onSave: () => void): void {
    renderAdd(): void {
        const hour = document.getElementById("hour") as HTMLSelectElement;
        const minute = document.getElementById("minute") as HTMLSelectElement;

        if (!hour || !minute) {
            return;
        }

        hour.selectedIndex = 0;
        minute.selectedIndex = 0;

        showModal();
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
        const element = document.getElementById("ruleMessage");
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
        const listSection = document.getElementById("listSection");
        const list = document.getElementById("alarmList");

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
                <button class="toggle-btn ${active}"></button>
            </li>
        `;
        }).join("");

        list.innerHTML = html;
    }
}