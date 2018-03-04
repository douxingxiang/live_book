import EventEmitter from "events";

class FetchLoader extends EventEmitter {
	static RESPONSE_OK = "response_ok";
	static RESPONSE_NOTOK = "response_not_ok";
	static RESPONSE_ERROR = "response_error";
	static READ_DONE = "read_on";
	static READ_CHUNK = "read_not_ok";
	static READ_ERROR = "read_error";

	constructor() {
		//@todo默认参数 
		this._defaultParams = {
		};
		//是否停止拉取
		this._stopFetch = false;

		super();
	}

	load(url, params) {
		let p = params || this._defaultParams;
		self.fetch(url, params).then( (response) => {
			if(response.ok) {
				this.emit(FetchLoader.RESPONSE_OK, response);
				this.pump(response.body.getReader());
			} else {
				this.emit(FetchLoader.RESPONSE_NOTOK, response);
			}
		}).catch( (error) => {
			this.emit(FetchLoader.RESPONSE_ERROR, error);
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
				this.emit(FetchLoader.READ_DONE, chunk);
				this.pump(reader);
			} else {
				this.emit(FetchLoader.READ_CHUNK, chunk);
			}
		}).catch( (error) => {
			this.emit(FetchLoader.READ_ERROR, error);
		});
	}

	/**
	 * 是否可以fetch加载、reader读取
	 */
	static isSupport() {
		return FetchLoader.isSupportFetch() && FetchLoader.isSupportStream(); 
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
