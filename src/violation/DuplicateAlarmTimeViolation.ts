
import { type AlarmViolation } from "./AlarmViolation";

export class DuplicateAlarmTimeViolation implements AlarmViolation {
    readonly message = "同時刻の設定はできません(既にその時刻は設定されています)";
}