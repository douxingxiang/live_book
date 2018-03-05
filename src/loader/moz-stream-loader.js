import StreamLoader from "./StreamLoader";

class MozStreamLoader extends StreamLoader {
        
    constructor() {
        this._defaultParams = {
            method: "GET",
            withCredentials: false
        };
        //是否支持
        this._isSupport = undefined;
        this._xhr = null;
        this._stopFetch = false;

        super();
    }
    
    load(url, params) {
        if(!this._xhr) {
            this._xhr = new XMLHttpRequest();
        }
        
        let p = params || this._defaultParams;

        this._xhr.open(p.method, url, true);
        this._xhr.responseType = "moz-chunked-arraybuffer";
        if(!this.e) {
            this.e = {
                onProgress: this.onProgress.bind(this),
                onError: this.onError.bind(this),
                onLoad: this.onLoad.bind(this),
                onReadyStateChange: this.onReadyStateChange.bind(this)

            };

            this._xhr.onreadystatechange = this.e.onReadyStateChange;
            this._xhr.onloadend = this.e.onLoad;
            this._xhr.onprogress = this.e.onProgress;
            this._xhr.onerror = this.e.onError;
        }
        
        this._xhr.withCredentials = p.withCredentials;

        this._xhr.send();

    }

    cancel() {
        if(this._xhr) {
            this._xhr.abort();
        }
    }

    onReadyStateChange(e) {
        if(this._xhr.readyState === 2) {
            if(this._xhr.status % 200 !== 2) {
                this.emit(StreamLoader.RESPONSE_NOTOK, {
                    code: this._xhr.status,
                    msg: this._xhr.statusText});
            } else {
                this.emit(StreamLoader.RESPONSE_OK);
            }
        }
    }

    onLoad(e) {
        this.emit(StreamLoader.READ_DONE);
    }

    onProgress(e) {
        let buffer = this._xhr.response;
        this.emit(StreamLoader.READ_CHUNK, buffer);
    }

    onError(e) {
        this.emit(StreamLoader.RESPONSE_ERROR, e);
    }
    
    /**
     * 检查是否支持moz-chunked-arraybuffer响应类型
     */
    static isSupport() {
        if(this._isSupport === undefined) {
            this._isSupport = true;
            try {
                let xhr = new XMLHttpRequest();
                //firefox 37-需要open
                xhr.open('GET', "https://example.domain");
                xhr.responseType = "moz-chunked-arraybuffer";
            } catch(error) {
                this._isSupport = false;
            }
        }
        return this._isSupport;

    }
}

export default MozStreamLoader;
