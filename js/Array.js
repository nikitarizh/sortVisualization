// extending Array class

// get min and max from array
Array.prototype.minMax = function() {
    let mn = 1e9;
        let mx = 0;
        for (let i = 0; i < this.length; i++) {
            if (this[i] > mx) {
                mx = this[i];
            }
            if (this[i] < mn) {
                mn = this[i];
            }
        }

        return { mn, mx };
}

// check if array is sorted
Array.prototype.isSorted = function() {
    for (let i = 1; i < this.length; i++) {
        if (this[i].val < this[i - 1].val) {
            return false;
        }
    }

    return true;
}

// swap arr[i] and arr[j]
Array.prototype.swap = function(i, j) {
    let temp = this[i];
    this[i] = this[j];
    this[j] = temp;
}