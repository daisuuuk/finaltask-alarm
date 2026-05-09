
import { LocalStorageManager } from "./infra/LocalStorageManager"
import { AlarmDataManager } from "./infra/AlarmDataManager";
import { AlarmList } from "./domain/AlarmList";
import { TimeScheduler } from "./service/TimeScheduler";
import { SoundPlayer } from "./infra/SoundPlayer";
import { ManagerService } from "./service/ManagerService";
import { ExecutionService } from "./service/ExecutionService";
import { AddDisplay, ListDisplay, RuleDisplay, EditDisplay } from "./display/DomDisplay";
import { AlarmDisplayController } from "./controller/AlarmDisplayController";
import { type ButtonType, Buttons } from "./domain/ButtonType";
import { Button } from "./common/Button";
import { ScreenNavigator } from "./common/ScreenNavigator";
import { Screen } from "./common/Screen";

// 生成順は下位レイヤーから

const storage = new LocalStorageManager();
const dataManager = new AlarmDataManager(storage);

const alarmList = new AlarmList();

const scheduler = new TimeScheduler();
const sound = new SoundPlayer();

const managerService = new ManagerService(alarmList, dataManager);
const executionService = new ExecutionService(scheduler, sound)

const editDisplay = new EditDisplay();
const addDisplay = new AddDisplay();
const listDisplay = new ListDisplay();
const ruleDisplay = new RuleDisplay();

const ui = new AlarmDisplayController(
  editDisplay,
  addDisplay,
  listDisplay,
  ruleDisplay,
  managerService,
  executionService,
  // buttons,
);

// ① 親要素を取得
const mainArea = document.getElementById("alarm-button-area");
if (!mainArea) {
  throw new Error("alarm-button-areaが存在しない");
}

const subArea = document.getElementById("alarm-sub-button-area");
if (!subArea) {
  throw new Error("alarm-sub-button-areaが存在しない");
}

// ② Button生成 + 登録 + 配置
const addButton = createButton(Buttons.ADD);
const editButton = createButton(Buttons.EDIT);
const deleteButton = createButton(Buttons.DELETE);
const clearButton = createButton(Buttons.CLEAR);

// ③ UIに登録
ui.registerButton(Buttons.ADD, addButton);
ui.registerButton(Buttons.EDIT, editButton);
ui.registerButton(Buttons.DELETE, deleteButton);
ui.registerButton(Buttons.CLEAR, clearButton);

// ④ DOMに追加
addButton.appendTo(mainArea);
editButton.appendTo(subArea);
deleteButton.appendTo(subArea);
clearButton.appendTo(subArea);

ui.init();
console.log("起動されました");

/**
 * 一つずつ分けて生成(記載)するのではなくswitchでButton生成する
 * @param type 
 * @returns 
 */
function createButton(type: ButtonType): Button {
  switch (type) {
    case Buttons.ADD:
      return new Button({
        text: "アラームを追加+",
        className: "alarm-add-btn"
      });

    case Buttons.EDIT:
      return new Button({
        text: "編集",
        className: "alarm-btn",
        disabled: true
      });

    case Buttons.DELETE:
      return new Button({
        text: "削除(一括)",
        className: "alarm-btn",
        disabled: true
      });

    case Buttons.CLEAR:
      return new Button({
        text: "一括解除",
        className: "alarm-btn",
        disabled: true
      });

    default:
      throw new Error("unknown button");
  }
}

// const editButton = new Button({
//     text: "編集",
//     className: "btn",
//     disabled: true
// });

// ーーーーーーーーーー

import './style.css';

/* ─── ビュー要素を取得 ─── */
const viewHome = document.getElementById('view-home') as HTMLElement | null;
const timerContainer = document.getElementById("timer-container") as HTMLElement | null;
const alarmContainer = document.getElementById("alarm-container") as HTMLElement | null;

/* ─── ホーム画面のメニューボタン ─── */
const menuButtons = document.querySelectorAll<HTMLButtonElement>('.home-menu-btn');
console.log("menuButtonsの数:", menuButtons.length);


if (!viewHome || !timerContainer || !alarmContainer) {
    throw new Error("画面要素が見つかりません");
}


const screenNavigator = new ScreenNavigator(
    viewHome!,
    timerContainer!,
    alarmContainer!
);


/* ─── ホーム画面ボタンのイベントリスナー ─── */
menuButtons.forEach((btn) => {
    console.log("イベント登録:", btn.dataset["target"]);
    btn.addEventListener("click", () => {
        const target = btn.dataset["target"] ?? 'home';
        if (target === "timer") {
            console.log("タイマーへ切替");
            screenNavigator.switchTo(Screen.Timer);
        } else if (target === "alarm") {
            screenNavigator.switchTo(Screen.Alarm);
        } else {
            screenNavigator.switchTo(Screen.Home);
        }
    });
});



/* ─── タイマー画面内のナビリンク ─── */
const timerNavLinks = document.querySelectorAll<HTMLAnchorElement>('.timer-nav-link');

timerNavLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
        e.preventDefault();
        const target = link.dataset["target"] ?? "home";
        if (target === "timer") {
            return;
        } else if (target === "alarm") {
            screenNavigator.switchTo(Screen.Alarm);
        } else {
            screenNavigator.switchTo(Screen.Home);
        }
    })
})