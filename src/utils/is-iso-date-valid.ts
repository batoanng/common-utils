/**
 * Validate an ISO date string
 * @param isoDateString
 */
export function isIsoDateValid(isoDateString: any): isoDateString is string {
    return !isNaN(Date.parse(isoDateString));
}
