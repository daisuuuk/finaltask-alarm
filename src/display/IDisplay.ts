
import { Alarm } from "../domain/alarm/Alarm";

export interface IDisplay {
    renderInitial(): void;
    renderMissedAlarm(): void;
}

export interface IEditDisplay {
    renderEdit(alarm: Alarm): void;
    renderClose(): void;
}

export interface IAddDisplay {
    renderAdd(): void;
    renderClose(): void;
}

export interface IListDisplay {
    renderList(alarms: Alarm[], selectedIds: Set<string>): void;
}

export interface IRuleDisplay {
    renderRule(message: string): void;
}

export interface IModalDisplay {
    renderOpenAlertModal(props: {
        title: string;
        onStop: () => void;
    }): void;

    renderCloseAlertModal(): void;
}