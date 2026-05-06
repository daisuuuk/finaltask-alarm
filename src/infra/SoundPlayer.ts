
import { type ISoundPlayer } from "../common/ISoundPlayer";

export class SoundPlayer implements ISoundPlayer {
    private audio: HTMLAudioElement;

    constructor() {
        this.audio = new Audio("/sounds/notification.mp3");
        this.audio.loop = true;
    }
    startSound(): void {
        if (this.audio.paused === false) {
            this.stopSound();
        }
        this.audio.currentTime = 0;
        this.audio.play();

    };
    stopSound(): void {
        this.audio.pause();
        this.audio.currentTime = 0;
    };
}