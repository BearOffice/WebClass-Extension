var TimeTrigger = /** @class */ (function () {
    function TimeTrigger(time) {
        this.check = setTimeout(function () { }, 0);
        this.single = true;
        this.time = time;
    }
    TimeTrigger.prototype.timeCheck = function (func) {
        var _this = this;
        // Limit timecheck
        if (this.single == false)
            return;
        this.single = false;
        this.check = setTimeout(function () {
            func();
            _this.single = true;
        }, this.time);
    };
    TimeTrigger.prototype.clearTimeCheck = function () {
        clearTimeout(this.check);
        this.single = true;
    };
    return TimeTrigger;
}());
export { TimeTrigger };
//# sourceMappingURL=timetrigger.js.map