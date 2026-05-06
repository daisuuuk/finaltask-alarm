
import { Alarm } from "../domain/Alarm";

export interface IDisplay {
    renderInitial(): void;
    renderAlertDialog(alarm: Alarm): void
    renderMissedAlarm(): void;
}

export interface IEditDisplay {
    renderEdit(alarm: Alarm): void
}

export interface IAddDisplay {
    // renderAdd(onSave: () => void): void
    renderAdd(): void
}

export interface IListDisplay {
    renderList(alarms: Alarm[], selectedIds: Set<string>): void;
}

export interface IRuleDisplay {
    renderRule(message: string): void;
    // clearRule(): void;
}