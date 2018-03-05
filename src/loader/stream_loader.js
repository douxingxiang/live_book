import EventEmitter from "events";

class StreamLoader extends EventEmitter {
    static RESPONSE_OK = "response_ok";
	static RESPONSE_NOTOK = "response_not_ok";
	static RESPONSE_ERROR = "response_error";
	static READ_DONE = "read_done";
	static READ_CHUNK = "read_chunk";
	static READ_ERROR = "read_error";

    constructor() {
        super()

        this._defaultParams = {};
        this._stopFetch = false;
    }

    load(url, params) {
    }

    cancel() {
    }

    static isSupported() {
    }
}

export default StreamLoader;
