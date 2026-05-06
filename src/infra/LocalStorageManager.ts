
/**
 * 「保存」と「読み取り」のみの役割(永続化管理)
 */
export class LocalStorageManager {
    // キーと値のペアで保存するための引数が必要
    public saveAlarmData(key: string, data: string): void {
        // キーと値で保存する
        localStorage.setItem(key, data);
    }
    
    // キーで読み込むための引数が必要。戻り値は文字列か存在しなければnull
    public loadAlarmData(key: string): string | null {
        // 一時的に記載しているだけ
        // localStorage.clear();
        // localStorage.removeItem("alarms");
        // キーで取得する
        return localStorage.getItem(key);
    }
    
}