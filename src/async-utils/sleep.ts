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
