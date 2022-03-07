<template>
	<view>
		<image src="../../static/logo-1.png" class="logo" mode="widthFix"></image>
		<view class="logo-title">在线办公系统</view>
		<view class="logo-subtitle">Ver 2021.4</view>
	</view>
</template>

<script>
export default {
	data() {
		return {};
	},
	onLoad() {
		//有token
		if (uni.getStorageSync('token')) {
			setTimeout(function() {
				uni.switchTab({
					url: '/pages/index/index',
					animationType: 'pop-in',
					animationDuration: 300
				});
			}, 2500);
		} else {
			setTimeout(function() {
				//去登录
				uni.navigateTo({
					url: '/pages/login/login',
					animationType: 'pop-in',
					animationDuration: 300
				});
			}, 2500);
		}
	},
	methods: {}
};
</script>

<style lang="less">
@import url('launch_page.less');
</style>
