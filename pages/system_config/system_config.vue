<template>
	<view class="content">
		<div class="item" v-for="(item, index) in sysConfigs" :key="item.id">
			<div class="lable">{{ item.remark }}</div>
			<picker mode="time" :value="item.paramValue" @change="bindTimeChange($event, index)">
				<view class="uni-input">{{ item.paramValue }}</view>
			</picker>
		</div>
		<button class="btn" @tap="save()">应用</button>
	</view>
</template>

<script>
// import dyDatePicker from '../../components/dy-Date/dy-Date.vue'
export default {
	components: {},
	data() {
		return {
			sysConfigs: []
			// attendanceStartTime: '06:00',
			// attendanceTime: '08:30',
			// attendanceEndTime: '09:30' ,
			// closingStartTime: '16:30',
			// closingTime: '17:30',
			// closingEndTime: '20:30'
		};
	},
	onLoad() {},
	onShow() {
		let that = this;
		that.ajax(that.url.getSystemConfig, 'POST', {}, function(resp) {
			let result = resp.data.result;
			that.sysConfigs = result;
			console.log(result);
		});
	},
	methods: {
		save() {
			let that = this;
			that.ajax(that.url.saveSystemConfig, 'POST', { sysConfigs: that.sysConfigs }, function(resp) {
				uni.showToast({
					icon: 'none',
					title: '应用成功'
				});
			});
		},
		bindTimeChange: function(e, index) {
			this.sysConfigs[index].paramValue = e.target.value;
		}
	}
};
</script>

<style lang="less">
@import url('../../style.less');
.item {
	padding: 30rpx 100rpx 30rpx 15rpx;
	border-bottom: solid 1rpx #f0f0f0;
	font-size: 35rpx;
	color: #333;
	display: flex;
	justify-content: space-between;
	.key {
	}
	.value {
		display: flex;
		color: #333;
	}
}
.btn {
	margin: 35rpx 35rpx 35rpx 55rpx;
	background-color: @background-color;
	color: #fff;
	&:active {
		background-color: @background-color-active;
	}
}
</style>
