
export class SetUpEventBinder {
    public bindList(
        root: Document,
        onToggle: (id: string) => void,
        onSelect: (id: string) => void
    ): void {
        root.addEventListener("click", (element) => {
            const target = element.target as HTMLElement;

            // トグル
            if (target.classList.contains("alarm-toggle-btn")) {
                element.stopPropagation();

                const item = target.closest(".alarm-item");
                if (!(item instanceof HTMLElement) || !item.dataset.id) return;

                onToggle(item.dataset.id);
                return;
            }

            // 行クリック
            const item = target.closest(".alarm-item");
            if (!(item instanceof HTMLElement) || !item.dataset.id) return;

            onSelect(item.dataset.id);
        });
    }

    public bindModal(
        saveBtn: HTMLElement,
        cancelBtn: HTMLElement,
        overlay: HTMLElement,
        onSave: () => void
    ): void {
        saveBtn.addEventListener("click", () => {
            onSave();
            overlay.classList.add("hidden");
        });

        cancelBtn.addEventListener("click", () => {
            overlay.classList.add("hidden");
        });
    }
}

/**
     * 各ボタン押下で状態更新し、ボタン更新(グレーアウト)をする関数。→ selectedIds と同期させる
     */
// private setupAlarmListEvent() {
//     // 「ON/OFF切替」と「行クリック」のイベント処理
//     // イベントデリゲーション(各子要素にハンドラを登録する代わりに、共通の親要素に対してハンドラを一括して登録する仕組み)
//     // const list = document.getElementById("list");

//     // 「list」に限定することで、不要なイベントを防ぐ
//     document.addEventListener("click", (element) => {
//         const target = element.target as HTMLElement;

//         // トグルボタン(ON/OFF切替)
//         if (target.classList.contains("alarm-toggle-btn")) {
//             // 「stopPropagation()」 = イベントが親に伝わるのを止める役割(イベントバブリングを防ぐ)
//             element.stopPropagation();
//             console.log("トグル");

//             // target.closest() は Element | null を返す
//             const item = target.closest(".alarm-item");
//             if (!(item instanceof HTMLElement)) {
//                 return;
//             }

//             // dataset は HTMLElement にしか存在しない
//             const id = item.dataset.id;     // ← ここでidを取得！！！
//             if (!id) {
//                 return
//             }

//             this.onToggleClicked(id);

//             return;
//         }

//         // 行クリック
//         // 「closest」 = 自分 or 親をたどって一致する要素を探す
//         const item = target.closest(".alarm-item");
//         if (!(item instanceof HTMLElement)) {
//             return;
//         }
//         if (item) {
//             // item.classList.toggle("selected");
//             const id = item.dataset.id;     // ← ここでidを取得！！！
//             if (!id) {
//                 return
//             }

//             this.onRowClicked(id);
//         }
//     });
// }

// ーーーーーーーーーー

// private setupModalEvent(): void {
//     const overlay = document.getElementById("alarm-modal-overlay");
//     const saveBtn = document.getElementById("SAVE");
//     const cancelBtn = document.getElementById("CANCEL");

//     if (!overlay || !saveBtn || !cancelBtn) {
//         return;
//     }

//     saveBtn.addEventListener("click", () => {
//         this.onButtonClicked("SAVE");
//         overlay.classList.add("hidden");
//     });

//     cancelBtn.addEventListener("click", () => {
//         overlay.classList.add("hidden");
//     });
// }
