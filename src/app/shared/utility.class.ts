/**
 * The static class that defines utility methods.
 *
 * @class Utils
 */

declare let require: any;
declare let process: any;

export class Utils {
    /**
     * Checks whether the platform is NW.js.
     *
     * @static
     * @method isNwjs
     * @return {Boolean} True if the platform is NW.js
     */
    public static isNwjs() {
        return typeof require === 'function' && typeof process === 'object';
    }
    /**
     * Checks whether the platform is a mobile device.
     *
     * @static
     * @method isMobileDevice
     * @return {Boolean} True if the platform is a mobile device
     */
    public static isMobileDevice() {
        const r = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
        return !!navigator.userAgent.match(r);
    }

    /**
     * Checks whether the browser is Mobile Safari.
     *
     * @static
     * @method isMobileSafari
     * @return {Boolean} True if the browser is Mobile Safari
     */
    public static isMobileSafari() {
        const agent = navigator.userAgent;
        return !!(agent.match(/iPhone|iPad|iPod/) && agent.match(/AppleWebKit/) &&
            !agent.match('CriOS'));
    }

    /**
     * Checks whether the browser is Android Chrome.
     *
     * @static
     * @method isAndroidChrome
     * @return {Boolean} True if the browser is Android Chrome
     */
    public static isAndroidChrome() {
        const agent = navigator.userAgent;
        return !!(agent.match(/Android/) && agent.match(/Chrome/));
    }

    /**
     * Makes a CSS color string from RGB values.
     *
     * @static
     * @method rgbToCssColor
     * @param r The red value in the range (0, 255)
     * @param g The green value in the range (0, 255)
     * @param b The blue value in the range (0, 255)
     * @return {String} CSS color string
     */
    public static rgbToCssColor(r, g, b) {
        r = Math.round(r);
        g = Math.round(g);
        b = Math.round(b);
        return 'rgb(' + r + ',' + g + ',' + b + ')';
    }

    public static padZero(num: number, length: number) {
        let value = num.toString();
        for (let i = 0; value.length < length; i++) {
            value = '0' + value;
        }
        return value;
    }

    public static parseXML(data) {
        const items: any[] = [];
        // request outages.xml from the server and then you can extract the information like this
        const parser = new DOMParser();
        const xmlDoc: any = parser.parseFromString(data, 'text/xml');

        // getElementsByTagName returns a sudo-array
        const entries = Array.prototype.slice.call(
            xmlDoc.getElementsByTagName('entry'),
        );

        entries.forEach((entry) => {
            // <content> <properties> ==> <id></id><title></title> etc
            const content = entry.getElementsByTagName('content')[0]
                .childNodes[0].childNodes;
            const obj = {};

            content.forEach((field) => {
                // looks like d:Id, d:Title etc
                const name = field.nodeName.slice(2).toLowerCase();
                const c = field.textContent;

                obj[name] = c;
            });
            items.push(obj);
        });
        return items;
    }

    constructor() {
        throw new Error('This is a static class');
    }
}
