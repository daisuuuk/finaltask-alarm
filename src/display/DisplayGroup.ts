
import { type IAddDisplay, type IListDisplay, type IRuleDisplay, type IEditDisplay, type IModalDisplay } from "../display/IDisplay";

export class DisplayGroup {
    constructor(
        public edit: IEditDisplay,
        public add: IAddDisplay,
        public list: IListDisplay,
        public rule: IRuleDisplay,
        public modal: IModalDisplay,
    ) {}
}