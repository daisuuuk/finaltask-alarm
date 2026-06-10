
export class ModalService {
    /**
 * モーダルを表示にする処理
 * AddとEditで共通
 * @returns 
 */
    public showModalView(): void {
        const overlay = document.getElementById("alarm-modal-overlay");
        console.log(`${overlay}`);
        if (!overlay) {
            return;
        }

        // 表示
        overlay.classList.remove("hidden");
    }

    /**
         * モーダルを非表示にする処理
         * @returns 
         */
    public hideModalView(): void {
        const overlay = document.getElementById("alarm-modal-overlay");
        if (!overlay) return;

        overlay.classList.add("hidden");
    }
}