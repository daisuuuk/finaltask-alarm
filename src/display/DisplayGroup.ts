
import { type IAddDisplay, type IListDisplay, type IRuleDisplay, type IEditDisplay } from "../display/IDisplay";


export class DisplayGroup {
    constructor(
        public edit: IEditDisplay,
        public add: IAddDisplay,
        public list: IListDisplay,
        public rule: IRuleDisplay
    ) {}
}