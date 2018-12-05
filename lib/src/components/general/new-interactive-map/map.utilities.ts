/*
 *  Utility functions for maps
 */

export class MapUtilities {
    constructor() {
        throw new Error('class is static')
    }

    public static base64Encode(str) {
        // first we use encodeURIComponent to get percent-encoded UTF-8,
        // then we convert the percent encodings into raw bytes which
        // can be fed into btoa.
        return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
            function toSolidBytes(match, p1) {
                return String.fromCharCode(('0x' + p1) as any);
        }));
    }
}