import { type ButtonClickHandler } from "./Button";

/**
 * ボタンを作るときに指定する設定
 */
export interface ButtonOptions {
    /** ボタンに表示する文字 */
    text: string,
    /** ボタンに付けるクラス名 */
    className?: string,
    /** ボタンを押せない状態にするかどうか */
    disabled?: boolean,
    /** ボタンがクリックされたときの処理 */
    onClick?: ButtonClickHandler
}