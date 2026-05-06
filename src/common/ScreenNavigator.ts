
import { Screen } from "./Screen";

/**
 * 画面遷移を管理するクラス
 *
 * Home / Timer / Alarm の各画面要素を保持
 * 現在表示中の画面は currentScreen として内部で管理される。
 */
export class ScreenNavigator {
    /** 現在表示中の画面要素 */
    private currentScreen: HTMLElement;
    /** ホーム画面要素 */
    private homeScreen: HTMLElement;
     /** タイマー画面要素 */
    private timerScreen: HTMLElement;
    /** アラーム画面要素 */
    private alarmScreen: HTMLElement;

    constructor(homeScreen: HTMLElement,timerScreen: HTMLElement,alarmScreen: HTMLElement) {

        this.homeScreen = homeScreen;
        this.timerScreen = timerScreen;
        this.alarmScreen = alarmScreen;
        // 初期表示はホーム画面
        this.currentScreen = homeScreen;
    }

    public switchTo(screen: Screen): void {
        this.hideAllScreens();

        switch (screen) {
            case Screen.Home:
                this.show(this.homeScreen);
                break;

            case Screen.Timer:
                this.show(this.timerScreen);
                break;

            case Screen.Alarm:
                this.show(this.alarmScreen);
                break;

            default:
                this.show(this.homeScreen);
        }
    }

    /**
     * すべての画面を非表示にする
     */
    private hideAllScreens(): void {
        this.homeScreen.classList.add("view-hidden");
        this.timerScreen.classList.add("view-hidden");
        this.alarmScreen.classList.add("view-hidden");
    }

    /**
     * 指定された画面を表示し、現在の画面として更新する
     *
     * @param screenElement 表示する画面のHTMLElement
     */
    private show(screenElement: HTMLElement): void {
        screenElement.classList.remove("view-hidden");
        this.currentScreen = screenElement;
    }
}