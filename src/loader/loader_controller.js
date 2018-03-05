import StreamLoader from "./stream_loader";
import FetchLoader from "./fetch_loader";
import MozStreamLoader from "./moz_stream_loader";

class LoaderController {
    static _ins = null;

    constructor() {
        this._loader = null;
    }

    getLoader() {
        if(!this._loader) {
            if(FetchLoader.isSupport()) {
                this._loader = new FetchLoader();
            }  else if(MozStreamLoader.isSupport()) {
                this._loader = new MozStreamLoader();
            }
        }
        return this._loader;
    }

    static getLoader() {
        if(!LoaderController._ins) {
            LoaderController._ins = new LoaderController();
        }

        return LoaderController.getLoader();
    }
}

export default LoaderController;
