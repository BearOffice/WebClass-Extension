export class TimeTrigger {
    private time: number;
    private check = setTimeout(() => { }, 0);
    private single = true;

    constructor(time: number) {
        this.time = time;
    }

    timeCheck(func: () => void) {
        // Limit timecheck
        if (this.single == false) return;
        this.single = false;
        this.check = setTimeout(() => {
            func();
            this.single = true;
        }, this.time);
    }

    clearTimeCheck() {
        clearTimeout(this.check);
        this.single = true;
    }
}