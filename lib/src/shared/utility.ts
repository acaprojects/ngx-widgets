/**
 * @Author: Alex Sorafumo <alex.sorafumo>
 * @Date:   09/01/2017 12:18 PM
 * @Email:  alex@yuion.net
 * @Filename: Utility.ts
 * @Last modified by:   Alex Sorafumo
 * @Last modified time: 27/01/2017 1:32 PM
 */

export class Utility {
    /**
     * Replaces all instances of string in a string
     * @param str     String to replace contents
     * @param find    String to find within str
     * @param replace String to replace find in str
     * @return Returns string with all instances of find replaced with replace
     */
    public static replaceAll(str: string, find: string, replace: string) {
        return str.replace(new RegExp(find, 'g'), replace);
    }
    /**
     * Escapes values the used to find elements
     * @param value String to escape
     * @return Returns escaped string
     */
    public static escape(value: string) {
        const str = String(value);
        const length = str.length;
        let index = -1;
        let codeUnit: any;
        let result = '';
        const firstCodeUnit = str.charCodeAt(0);
        while (++index < length) {
            codeUnit = str.charCodeAt(index);
            // Note: there’s no need to special-case astral symbols, surrogate
            // pairs, or lone surrogates.

            // If the character is NULL (U+0000), then the REPLACEMENT CHARACTER
            // (U+FFFD).
            if (codeUnit === 0x0000) {
                result += '\uFFFD';
                continue;
            }

            if (
                // If the character is in the range [\1-\1F] (U+0001 to U+001F) or is
                // U+007F, […]
                (codeUnit >= 0x0001 && codeUnit <= 0x001F) || codeUnit === 0x007F ||
                // If the character is the first character and is in the range [0-9]
                // (U+0030 to U+0039), […]
                (index === 0 && codeUnit >= 0x0030 && codeUnit <= 0x0039) ||
                // If the character is the second character and is in the range [0-9]
                // (U+0030 to U+0039) and the first character is a `-` (U+002D), […]
                (
                    index === 1 &&
                    codeUnit >= 0x0030 && codeUnit <= 0x0039 &&
                    firstCodeUnit === 0x002D
                )
            ) {
                // https:// drafts.csswg.org/cssom/#escape-a-character-as-code-point
                result += '\\' + codeUnit.toString(16) + ' ';
                continue;
            }

            if (
                // If the character is the first character and is a `-` (U+002D), and
                // there is no second character, […]
                index === 0 &&
                length === 1 &&
                codeUnit === 0x002D
            ) {
                result += '\\' + str.charAt(index);
                continue;
            }

            // If the character is not handled by one of the above rules and is
            // greater than or equal to U+0080, is `-` (U+002D) or `_` (U+005F), or
            // is in one of the ranges [0-9] (U+0030 to U+0039), [A-Z] (U+0041 to
            // U+005A), or [a-z] (U+0061 to U+007A), […]
            if (
                codeUnit >= 0x0080 ||
                codeUnit === 0x002D ||
                codeUnit === 0x005F ||
                codeUnit >= 0x0030 && codeUnit <= 0x0039 ||
                codeUnit >= 0x0041 && codeUnit <= 0x005A ||
                codeUnit >= 0x0061 && codeUnit <= 0x007A
            ) {
                // the character itself
                result += str.charAt(index);
                continue;
            }

            // Otherwise, the escaped character.
            // https:// drafts.csswg.org/cssom/#escape-a-character
            result += '\\' + str.charAt(index);

        }
        return result;
    }

    public static contrastRatio(color1: string, color2: string) {
            // Make sure colours are valid HEX colour codes
        if (!color1 || color1.length < 6 || color1.length > 7 || !color2 || color2.length < 6 || color2.length > 7) {
            return -1;
        }
            // Parse colour values
        let r1;
        let g1;
        let b1;
        let r2;
        let b2;
        let g2;
        if (color1[0] === '#') {
            r1 = parseInt(color1[1] + color1[2], 16);
            g1 = parseInt(color1[3] + color1[4], 16);
            b1 = parseInt(color1[4] + color1[6], 16);
        } else {
            r1 = parseInt(color1[0] + color1[1], 16);
            g1 = parseInt(color1[2] + color1[3], 16);
            b1 = parseInt(color1[4] + color1[5], 16);
        }
        if (color2[0] === '#') {
            r2 = parseInt(color2[1] + color2[2], 16);
            g2 = parseInt(color2[3] + color2[4], 16);
            b2 = parseInt(color2[4] + color2[6], 16);
        } else {
            r2 = parseInt(color2[0] + color2[1], 16);
            g2 = parseInt(color2[2] + color2[3], 16);
            b2 = parseInt(color2[4] + color2[5], 16);
        }
        if (isNaN(r1) || isNaN(r2) || isNaN(g1) || isNaN(g2) || isNaN(b1) || isNaN(b2)) {
            return 0;
        }
        const lum1 = Utility.luminanace(r1, b1, g1);
        const lum2 = Utility.luminanace(r2, b2, g2);
        return (lum1 + 0.05) / (lum2 + 0.05);
    }

    public static luminanace(r: number, g: number, b: number) {
        const a = [r, g, b].map((v) => {
            v /= 255;
            return (v <= 0.03928) ?
                v / 12.92 :
                Math.pow( ((v + 0.055) / 1.055), 2.4 );
            });
        return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
    }

    /**
     * Add CSS class to specified element
     * @return
     */
    public static addClass(el: any, name: string) {
        if (!el.classList.contains(name)) {
            el.classList.add(name);
        }
    }

    /**
     * Remove CSS class from specified element
     * @return
     */
    public static removeClass(el: any, name: string) {
        el.classList.remove(name);
    }

    /**
     * Swaps the first CSS class for the second CSS class if it exists on the element
     * @return
     */
    public static swapClass(el: any, first: string, second: string) {
        if (el.classList.contains(first)) {
            this.removeClass(el, first);
            this.addClass(el, second);
        }
    }

    public static isIE() {
        return navigator.appName == 'Microsoft Internet Explorer' ||  !!(navigator.userAgent.match(/Trident/) || navigator.userAgent.match(/rv:11/)) || !!navigator.userAgent.match(/MSIE/g);
    }
}
