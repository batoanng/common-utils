/**
 * This function group an array to a dictionary
 * Using a callback that can return a list of keys
 * then given item belongs to
 * it is similar to lodash's groupBy() function
 * except in can group by each element in a key which is an array (lodash groups by whole array)
 * @param items
 * @param keySelector
 */
export function groupByKeySet<T>(items: T[], keySelector: (value: T) => string[]) {
    const dictionary: Record<string, T[]> = {};

    for (const item of items) {
        const keys = keySelector(item);
        for (const key of keys) {
            if (!(key in dictionary)) {
                dictionary[key] = [];
            }
            dictionary[key].push(item);
        }
    }

    return dictionary;
}
