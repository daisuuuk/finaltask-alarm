
import { type AlarmCount } from "../controller/AlarmDisplayController";

// uiState.ts（など）
export function getButtonCount(count: AlarmCount) {
    return {
        canAdd: count.alarmsCount < 5,
        canEdit: count.selectedCount === 1,
        canDelete: count.selectedCount >= 1,
        canClear: count.selectedCount >= 1,
    };
}