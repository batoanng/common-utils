/**
 * sleep returns a promise that resolves after for the given
 * number of seconds using setTimeout
 */
export function sleep(seconds: number) {
    return new Promise<void>((resolve) => {
        setTimeout(() => {
            resolve();
        }, seconds * 1000); // miliseconds to seconds
    });
}

var obj1 = {
    valueOfThis: function () {
        return this;
    }
};
var obj2 = {
    valueOfThis: () => {
        return this;
    }
};

obj1.valueOfThis(); // Will return the object obj1
obj2.valueOfThis(); // Will return window/global object
