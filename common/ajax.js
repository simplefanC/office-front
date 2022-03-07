let ajax = function(url, method, data, fun) {
	// console.log("A")
	uni.request({
		"url": url,
		"method": method,
		"header": {
			//使用同步方法获取 若使用异步方法还需写回调函数
			token: uni.getStorageSync("token")
		},
		"data": data,
		success: function(resp) {
			if (resp.statusCode == 401) {
				// console.log("B")
				//如果用户没有登陆系统，就跳转到登陆页面
				uni.showToast({
					icon: "none",
					title: resp.data,
					success() {
						setTimeout(function() {
							//要延时执行的代码
							// uni.redirectTo({
							uni.reLaunch({
								url: "/pages/login/login"
							})
						}, 1500) //延迟时间
					}
				})
			} else if (resp.statusCode == 200 && resp.data.code == 200) {
				// console.log("C")
				//响应状态码 & 业务状态码
				let data = resp.data
				if (data.hasOwnProperty("token")) {
					//如果后端正常处理请求，还要判断响应中是否有Token。如果令牌刷新了，还要在本地存储Token
					let token = data.token
					console.log(token)
					uni.setStorageSync("token", token)
				}
				//执行传入的匿名函数
				fun(resp)
			} else {
				// console.log("D")
				//异常情况
				uni.showToast({
					icon: "none",
					title: resp.data
				})
			}
		},
		fail(e) {
			console.log(e)
		}
	})
}
export default ajax
