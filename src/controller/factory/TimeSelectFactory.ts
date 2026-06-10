
import { AlarmTime } from "../../domain/alarm/AlarmTime";

export class TimeFactory {
    public createOptions(max: number): HTMLOptionElement[] {
        return Array.from({ length: max }, (_, i) => {
            const val = String(i).padStart(2, "0");

            const option = document.createElement("option");
            option.value = val;
            option.textContent = val;

            return option;
        });
    }

    public createAlarmTimeSelect(hour: number, minute: number): AlarmTime {
        return new AlarmTime(hour, minute);
    }
}

/**
     * アラーム追加時の「時間・分」のセレクト生成
     */
// private createAlarmTimeSelect(): void {
//     const hourSelect = document.getElementById("alarm-hour") as HTMLSelectElement;
//     const minuteSelect = document.getElementById("alarm-minute") as HTMLSelectElement;

//     // 0〜23
//     for (let i = 0; i < 24; i++) {
//         // const option = document.createElement("option");
//         // option.value = String(i);
//         // option.text = i.toString().padStart(2, "0");
//         // ２桁統一 "07"と"7"など
//         const val = String(i).padStart(2, "0");
//         const option = document.createElement("option");
//         option.value = val;
//         option.textContent = val;

//         hourSelect.appendChild(option);
//     }

//     // 0〜59
//     for (let i = 0; i < 60; i++) {
//         const val = String(i).padStart(2, "0");
//         const option = document.createElement("option");
//         option.value = val;
//         option.textContent = val;
//         minuteSelect.appendChild(option);
//     }
// }