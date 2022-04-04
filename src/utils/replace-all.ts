export function replaceAll(text: string, value: string, replacement: string): string {
    if (text) {
        return text.split(value).join(replacement);
    }
    return '';
}
