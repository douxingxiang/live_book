import StreamLoader from "./StreamLoader";

class FetchLoader extends StreamLoader {

	constructor() {
		this._defaultParams = {
            method: "GET",
            headers: new self.Headers(),
            mode: "cors",
            cache: "default"
		};
		//是否停止拉取
		this._stopFetch = false;

		super();
	}

	load(url, params) {
		let p = params || this._defaultParams;

		self.fetch(url, p).then( (response) => {
			if(response.ok) {
				this.emit(StreamLoader.RESPONSE_OK, response);
				this.pump(response.body.getReader());
			} else {
				this.emit(StreamLoader.RESPONSE_NOTOK, response);
			}
		}).catch( (error) => {
			this.emit(StreamLoader.RESPONSE_ERROR, error);
		});
	}

	cancel() {
		this._stopFetch = true;
	}

	pump(reader) {
		reader.read().then( (chunk) => {
			if(this._stopFetch) {
				reader.cancel();
				this._stopFetch = false;
				return;
			}

			if(chunk.done) {
				this.emit(StreamLoader.READ_DONE, chunk);
				this.pump(reader);
			} else {
				this.emit(StreamLoader.READ_CHUNK, chunk);
			}
		}).catch( (error) => {
			this.emit(StreamLoader.READ_ERROR, error);
		});
	}

	/**
	 * 是否可以fetch加载、reader读取
	 */
	static isSupport() {
		return StreamLoader.isSupportFetch() && StreamLoader.isSupportStream(); 
	}

	/**
	 * fetch支持判断
	 */
	static isSupportFetch() {
		return "fetch" in window;
	}

	/**
	 * Stream API支持判断
	 */
	static isSupportStream() {
		return "ReadableStreamReader" in window;
	}
}

export default FetchLoader;
