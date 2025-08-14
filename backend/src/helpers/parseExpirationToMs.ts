/**
 * Parses a time string like '7d' or '15m' into milliseconds.
 * A more robust solution might use a library like `ms`.
 * @param timeStr The time string.
 * @returns Time in milliseconds.
 */
export const parseExpirationToMs = (timeStr: string): number => {
    const unit = timeStr.slice(-1);
    const value = parseInt(timeStr.slice(0, -1));
    switch (unit) {
        case 'd': return value * 24 * 60 * 60 * 1000;
        case 'h': return value * 60 * 60 * 1000;
        case 'm': return value * 60 * 1000;
        default: return value;
    }
}

export default parseExpirationToMs;