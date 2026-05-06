
import { type AlarmViolation } from "./AlarmViolation";

export class AlarmLimitExceededViolation implements AlarmViolation {
    readonly message = "これ以上追加できません";
}