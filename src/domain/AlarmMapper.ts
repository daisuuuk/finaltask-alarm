
import { Alarm } from "./Alarm";
import { AlarmTime } from "./AlarmTime";
import { type AlarmState } from "./AlarmState";

export type AlarmDTO = {
    id: string;
    hour: number;
    minute: number;
    state: AlarmState;
};

/**
 * Alarm → DTO（保存用）のメソッド
 * @param alarm 
 * @returns 
 */
export function toDTO(alarm: Alarm): AlarmDTO {
    const time = alarm.getTime();

    return {
        id: alarm.getId(),
        hour: time.hour,
        minute: time.minute,
        state: alarm.getState(),
    };
}

/**
 * DTO → Alarm（復元）のメソッド
 * @param dto 
 * @returns 
 */
export function fromDTO(dto: AlarmDTO): Alarm {
    const time = new AlarmTime(dto.hour, dto.minute);
    return new Alarm(time, dto.id, dto.state);
}