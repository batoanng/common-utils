/**
 * Transform a DD/MM/YYYY date string to ISO date string
 * @param dateString
 */
export function dateToIsoDate(dateString: string): string {
    const result = /(0[0-9]|[1-2][0-9]|3[0-1])\/(0[0-9]|1[012])\/([0-9]{4})/.exec(dateString);
    if (!result) {
        return undefined;
    }
    const dateOnly = `${result[3]}-${result[2]}-${result[1]}`;
    const isoDate = new Date(dateOnly).toISOString();
    return new Date(isoDate).toISOString().substring(0, 10) === dateOnly.substring(0, 10) && isoDate;
}
