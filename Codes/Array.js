Array.prototype.sorter = function (key) {
    if (key === undefined) {
        return this.sort((a, b) => a - b);
    } else {
        return this.sort((a, b) => a[key] - b[key]);
    }
};

