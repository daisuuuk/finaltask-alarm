
export const State = {
    // アラームOFF
    DISABLED: "DISABLE",
    // アラームONで待機(=WAITING)
    ENABLED: "ENABLED",
    // 音が鳴る
    RINGING: "RINGING",
} as const;

export type AlarmState = typeof State[keyof typeof State];