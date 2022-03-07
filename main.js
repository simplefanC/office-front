import Vue from 'vue'
import App from './App'
import url from 'common/api.js'
import ajax from 'common/ajax.js'

Vue.config.productionTip = false
Vue.prototype.$host = 'https://unidemo.dcloud.net.cn/';

App.mpType = 'app'

const app = new Vue({
	...App
})
app.$mount()

// Vue.prototype.tencent = {
// 	trtc: {
// 		appId: 1400506953,
// 		appKey: "cd4bcf4d017e1d4121f73477813a0f261a5cf140a1f46e747a9a4d40abc1f66b"
// 	}
// }
Vue.prototype.url = url

//封装ajax 并做了统一的异常处理
Vue.prototype.ajax = ajax
// 定义全局的权限验证函数
Vue.prototype.checkPermission = function(perms) {
	let permission = uni.getStorageSync("permission")
	let result = false;
	for (let one of perms) {
		if (permission.indexOf(one) != -1) {
			result = true;
			break;
		}
	}
	return result;
}

Date.prototype.format = function(fmt) {
	var o = {
		"M+": this.getMonth() + 1, //月份 
		"d+": this.getDate(), //日 
		"h+": this.getHours(), //小时 
		"m+": this.getMinutes(), //分 
		"s+": this.getSeconds(), //秒 
		"q+": Math.floor((this.getMonth() + 3) / 3), //季度 
		"S": this.getMilliseconds() //毫秒 
	};
	if (/(y+)/.test(fmt)) {
		fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	}
	for (var k in o) {
		if (new RegExp("(" + k + ")").test(fmt)) {
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k])
				.length)));
		}
	}
	return fmt;
}
// 定义常用的验证方法
Vue.prototype.checkNull = function(data, name) {
	if (data == null) {
		uni.showToast({
			icon: "none",
			title: name + "不能为空"
		})
		return true
	}
	return false
}
Vue.prototype.checkBlank = function(data, name) {
	if (data == null || data == "") {
		uni.showToast({
			icon: "none",
			title: name + "不能为空"
		})
		return true
	}
	return false
}
Vue.prototype.checkValidName = function(data, name) {
	if (data == null || data == "") {
		uni.showToast({
			icon: "none",
			title: name + "不能为空"
		})
		return true
	} else if (!/^[\u4e00-\u9fa5]{2,15}$/.test(data)) {
		uni.showToast({
			icon: "none",
			title: name + "内容不正确"
		})
		return true
	}
	return false
}
Vue.prototype.checkValidTel = function(data, name) {
	if (data == null || data == "") {
		uni.showToast({
			icon: "none",
			title: name + "不能为空"
		})
		return true
	} else if (!/^1[0-9]{10}$/.test(data)) {
		uni.showToast({
			icon: "none",
			title: name + "内容不正确"
		})
		return true
	}
	return false
}
Vue.prototype.checkValidEmail = function(data, name) {
	if (data == null || data == "") {
		uni.showToast({
			icon: "none",
			title: name + "不能为空"
		})
		return true
	} else if (!/^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/.test(data)) {
		uni.showToast({
			icon: "none",
			title: name + "内容不正确"
		})
		return true
	}
	return false
}
Vue.prototype.checkValidStartAndEnd = function(start, end) {
	let d1 = new Date("2000/01/01 " + start + ":00");
	let d2 = new Date("2000/01/01 " + end + ":00");
	if (d2.getTime() <= d1.getTime()) {
		uni.showToast({
			icon: "none",
			title: "结束时间必须大于开始时间"
		})
		return true
	}
	return false
}
