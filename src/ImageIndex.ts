import fs from "fs";
import * as hasher from "image-hash";

interface ISearchIndexConfiguration {
    root: string;
}

export default class SearchIndex {
    public readonly ROOT: string;
    map: Map<string, string> = new Map<string, string>();

    constructor();
    constructor(options: ISearchIndexConfiguration);
    constructor(options?: ISearchIndexConfiguration) {
        this.ROOT = options?.root ?? "./static/";
    }
    
    /**
     * Synchronizes this index's mapping.
     * 
     * This is done by iterating through the configured root and recursively hashes each image found
     */
    public sync() {
        for(const item of fs.readdirSync(this.ROOT)) {
            // ignore subdirectories
            if(this.isDirectory(item)) continue;

            // generate phash
            const path = this.ROOT + "/" + item;
            if(path.endsWith(".md")) continue;

            // TODO: Remove 'any' type annotations. Only temporary till image-hash fixes their stuff
            hasher.imageHash(path, 16, true, (error: any, data: any) => {
                if(error) throw error;

                console.log(path + " -> " + data);

                this.map.set(data, path);
            });
        }
    }

    private isDirectory(path: fs.PathLike): boolean {
        return fs.existsSync(path) && fs.lstatSync(path).isDirectory();
    }

    public contains(hash: string): boolean {
        return this.map.has(hash);
    }
}