
export const Buttons = {
    ADD: "ADD",
    EDIT: "EDIT",
    SAVE: "SAVE",
    DELETE: "DELETE",
    CLEAR: "CLEAR",   // 一括解除（一覧）
    CANCEL: "CANCEL", // モーダルのキャンセル
} as const;

export type ButtonType = typeof Buttons[keyof typeof Buttons];