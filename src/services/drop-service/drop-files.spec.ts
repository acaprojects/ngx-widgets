/**
* @Author: Stephen von Takack
* @Date:   13/09/2016 2:55 PM
* @Email:  steve@acaprojects.com
* @Filename: drop-files.spec.ts
* @Last modified by:   Alex Sorafumo
* @Last modified time: 15/12/2016 11:37 AM
*/

/// <reference path="../typings/main.d.ts" />
import {DropFiles} from './drop-files';


describe('drop file extraction class', () => {
    //let files: DropFiles;
    //let event: any;
    // beforeEach(() => {});

    describe('drop files class', () => {
        it('should extract the files from the event', () => {
            let event = {
                dataTransfer: {
                    files: [{
                        type: 'image/jpeg',
                        size: 200,
                        name: 'bob.jpeg'
                    }]
                }
            };
            let files = new DropFiles(event);

            expect(files.length).toBe(1);
            expect(files.totalSize).toBe(200);
            expect(files.calculating).toBe(false);
            expect(files.files).toEqual(event.dataTransfer.files);
            expect(files.promise).toBeDefined();
        });
    });
});
