
export class DropFiles {
    promise: Promise<DropFiles>;

    length:number = 0;
    totalSize:number = 0;
    files:Array<any> = [];
    calculating:boolean = false;

    private _pending:Array<any>;
    private resolve:any;
    private reject:any;

    constructor(event:any) {
        let files:Array<any> = event.dataTransfer.files,
            items:Array<any> = event.dataTransfer.items,
            either:Array<any> = items || files;

        this.promise = new Promise((resolve, reject) => {
            if (!either || files.length === 0) {
                reject('no files found');
                return;
            }

            // Do we have file path information available
            if (either[0].kind) {
                this.resolve = resolve;
                this.reject = reject;

                this._pending = [{
                    items: items,
                    folders: true,
                    path: ''
                }];
                this.calculating = true;
                // files are flattened so this should be accurate
                // at least until we are finished processing
                this.length = files.length;
                this._processPending();
            } else {
                let i, file;

                // Clone the files array
                for (i = 0; i < files.length; i += 1) {
                    file = files[i];

                    // ensure the file has some content
                    if (file.type || file.size > 0) {
                        this.totalSize += file.size;
                        this.files.push(file);
                    }
                }

                this.length = files.length;
                resolve(this);
            }
        });
    }

    // Extracts the files from the folders
    private _processPending() {
        if (this._pending.length > 0) {
            let item = this._pending.shift(),
                items = item.items,
                length = items.length;

            // Let's ignore this folder
            if (length === 0 || length === undefined) {
                setTimeout(this._processPending.bind(this), 0);
                return;
            }

            // Check if this pending item has any folders
            if (item.folders) {
                let i,
                    entry,
                    obj,
                    count = 0,
                    new_items = [],
                    checkCount = () => {
                        // Counts the entries processed so we can add any files to the queue
                        count += 1;
                        if (count >= length) {
                            if (new_items.length > 0) {
                                // add any files to the start of the queue
                                this._pending.unshift({
                                    items: new_items,
                                    folders: false
                                });
                            }
                            setTimeout(this._processPending.bind(this), 0);
                        }
                    },
                    processEntry = (entry, path) => {
                        // If it is a directory we add it to the pending queue
                        try {
                            if (entry.isDirectory) {
                                entry.createReader().readEntries((entries) => {
                                    this._pending.push({
                                        items: entries,
                                        folders: true,
                                        path: path + entry.name + '/'
                                    });
                                    checkCount();
                                });
                            } else if (entry.isFile) {
                                // Files are added to a file queue
                                entry.file((file) => {
                                    file.dir_path = path;

                                    if (file.type || file.size > 0) {
                                        this.totalSize += file.size;
                                        new_items.push(file);
                                    }

                                    checkCount();
                                });
                            } else {
                                checkCount();
                            }
                        } catch (err) {
                            checkCount();
                        }
                    };

                for (i = 0; i < length; i += 1) {
                    // first layer of DnD folders require you to getAsEntry
                    if (item.path.length === 0) {
                        obj = items[i];
                        obj.getAsEntry = obj.getAsEntry || obj.webkitGetAsEntry || obj.mozGetAsEntry || obj.msGetAsEntry;
                        if (obj.getAsEntry) {
                            entry = obj.getAsEntry();
                            processEntry(entry, item.path);
                        } else {
                            // Opera support
                            entry = obj.getAsFile();
                            if (entry.size > 0) {
                                this.totalSize += entry.size;
                                new_items.push(entry);
                            }
                            checkCount();
                        }
                    } else {
                        entry = items[i];
                        processEntry(entry, item.path);
                    }
                }
            } else {
                // Regular files where we can add them all at once
                this.files.push.apply(this.files, items);
                // Delay until next tick (delay and invoke apply are optional)
                setTimeout(this._processPending.bind(this), 0);
            }
        } else {
            this._completeProcessing();
        }
    }

    private _completeProcessing() {
        this.calculating = false;
        this.length = this.files.length;

        if (this.length > 0) {
            this.resolve(this);
        } else {
            this.reject('no files found');
        }
    }
}
