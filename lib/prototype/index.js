'use strict';
module.exports = function () {
  Date.prototype.addDays = function (d) {
    if (d) {
      var t = this.getTime();
      t = t + (d * 86400000);
      this.setTime(t);
    }
  };
};
