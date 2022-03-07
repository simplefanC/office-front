<template>
	<view><txl @ev="evFunc" :datas="datas" color="red" :index="true" name="name"></txl></view>
</template>

<script>
import txl from '@/components/yt-txl/index.vue';
export default {
	components: { txl },
	data() {
		return {
			datas: []
		};
	},
	onShow(){
		this.loadData()
	},
	methods: {
		loadData(){
			let that = this;
			that.ajax(that.url.searchAllUser, 'POST', {}, function(resp) {
				that.datas = resp.data.result;
				// that.list = result
			});
		},
		evFunc(data) {
			if(!data.tel){
				uni.showToast({
				    title: '号码为空',
				    icon: 'none'
				});
			}
			//拨打电话
			uni.makePhoneCall({
				phoneNumber: data.tel //仅为示例
			});
			console.log(data);
		}
	},
	mounted() {}
};
</script>
