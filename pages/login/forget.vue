<template>
	<view class="forget">
		<view class="content">
			<!-- 主体 -->
			<view class="main">
				<!-- <view class="tips">若你忘记了密码，可在此重置新密码。</view> -->
				<wInput v-model="oldPass" type="password" maxlength="12" placeholder="请输入旧密码" isShowPass></wInput>
				<wInput v-model="newPass" type="password" maxlength="12" placeholder="请输入新密码" isShowPass></wInput>
				<wInput v-model="confirmNewPass" type="password" maxlength="12" placeholder="请再次输入新密码" isShowPass></wInput>
				<!-- <wInput
					v-model="verCode"
					type="number"
					maxlength="4"
					placeholder="验证码"
					
					isShowCode
					codeText="获取重置码"
					setTime="30"
					ref="runCode"
					@setCode="getVerCode()"
				></wInput> -->
			</view>

			<wButton class="wbutton" text="重置密码" :rotate="isRotate" @click.native="startRePass()"></wButton>
		</view>
	</view>
</template>

<script>
let _this;
import {checkStr, checkPwd} from '../../common/tool.js'
import wInput from '../../components/watch-login/watch-input.vue'; //input
import wButton from '../../components/watch-login/watch-button.vue'; //button
export default {
	data() {
		return {
			oldPass: '', //电话
			newPass: '', //密码
			confirmNewPass: '', //验证码
			isRotate: false //是否加载旋转
		};
	},
	components: {
		wInput,
		wButton
	},
	mounted() {
		_this = this;
	},
	methods: {
		// getVerCode(){
		// 	//获取验证码
		// 	if (_this.phoneData.length != 11) {
		// 	     uni.showToast({
		// 	        icon: 'none',
		// 			position: 'bottom',
		// 	        title: '手机号不正确'
		// 	    });
		// 	    return false;
		// 	}
		// 	console.log("获取验证码")
		// 	this.$refs.runCode.$emit('runCode'); //触发倒计时（一般用于请求成功验证码后调用）
		// 	uni.showToast({
		// 	    icon: 'none',
		// 		position: 'bottom',
		// 	    title: '模拟倒计时触发'
		// 	});

		// 	setTimeout(function(){
		// 		_this.$refs.runCode.$emit('runCode',0); //假装模拟下需要 终止倒计时
		// 		uni.showToast({
		// 		    icon: 'none',
		// 			position: 'bottom',
		// 		    title: '模拟倒计时终止'
		// 		});
		// 	},3000)
		// },
		startRePass() {
			//重置密码
			if (this.isRotate) {
				//判断是否加载中，避免重复点击请求
				return false;
			}
			// if (this.oldPass.length != 11) {
			//     uni.showToast({
			//         icon: 'none',
			// 		position: 'bottom',
			//         title: '手机号不正确'
			//     });
			//     return false;
			// }
			//    if (this.newPass.length < 6) {
			//        uni.showToast({
			//            icon: 'none',
			// 		position: 'bottom',
			//            title: '密码不正确'
			//        });
			//        return false;
			//    }
			// if (this.verCode.length != 4) {
			//     uni.showToast({
			//         icon: 'none',
			// 		position: 'bottom',
			//         title: '验证码不正确'
			//     });
			//     return false;
			// }
			let that = this;
			if (that.newPass != that.confirmNewPass) {
				uni.showToast({
					icon: 'none',
					title: '新密码两次输入不一致'
				});
				return false;
			}
			if (that.newPass == that.oldPass) {
				uni.showToast({
					icon: 'none',
					title: '新密码和旧密码输入一致'
				});
				return false;
			}
			if(!checkStr(that.newPass, 'pwd')){
				uni.showToast({
					icon: 'none',
					title: '密码长度在6~12位之间，且只能包含字母、数字和下划线'
				});
				return false;
			}
			if(checkPwd(that.newPass)<3){
				uni.showToast({
					icon: 'none',
					title: '新密码强度太低，请重新输入新密码'
				});
				return false;
			}
			that.ajax(that.url.resetPass, 'POST', { oldPass: that.oldPass, newPass: that.newPass }, function(resp) {
				uni.showToast({
					icon: 'none',
					title: '重置密码成功'
				});
				uni.navigateBack();
			});
			console.log('重置密码成功');
			_this.isRotate = true;
			setTimeout(function() {
				_this.isRotate = false;
			}, 3000);
		}
	}
};
</script>

<style>
@import url('../../components/watch-login/css/icon.css');
@import url('./css/main.css');
</style>
