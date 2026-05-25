
import { Alarm } from "../domain/Alarm";

export interface IDisplay {
    renderInitial(): void;
    renderMissedAlarm(): void;
}

export interface IEditDisplay {
    renderEdit(alarm: Alarm): void;
    renderClose(): void;
}

export interface IAddDisplay {
    // renderAdd(onSave: () => void): void
    renderAdd(): void;
    renderClose(): void;
}

export interface IListDisplay {
    renderList(alarms: Alarm[], selectedIds: Set<string>): void;
}

export interface IRuleDisplay {
    renderRule(message: string): void;
    // clearRule(): void;
}

export interface IModalDisplay {
    renderOpenAlertModal(props: {
        title: string;
        onStop: () => void;
    }): void;

    renderCloseAlertModal(): void;
}