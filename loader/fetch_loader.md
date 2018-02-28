# Fetch loader

> 通过window.fetch加载直播流，当前主流浏览器（除IE外）基本都支持。

### 判断是否支持fetch

```js
function isSupportFetch() {
	return "fetch" in window;
}
```

### fetch的加载方式

```js
function load(url, params) {
	self.fetch(url, params).then( function(response) {
		if( response.ok) {
			//此处需要判断浏览器是否支持Stream API, if("body" in response)
			pump(response.body.getReader());
		} else {
			//响应数据异常
			console.log(`${response.code}: ${response.statusText}`);
		}
	}).catch( function(error) {
		console.log(`${error.code}: ${error.message}`);
	});
}

function pump(reader) {
	reader.read().then( function(chunk) {
		if(chunk.done) {
			//读取完毕
		} else {
			let buffer = chunk.value;
			//@todo 消费数据buffer
			return pump(reader); //继续读取
		}
	}).catch( function(error) {
		//读取出现问题
	});
}
```
