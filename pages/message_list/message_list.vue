<template>
	<view class="page">
		<uni-list>
			<uni-list-chat
				v-for="one in list"
				:key="one.id"
				:title="one.senderName"
				:avatar="one.senderPhoto"
				:note="one.msg"
				badge-positon="left"
				:badge-text="one.readFlag ? '' : 'dot'"
				link="navigateTo"
				:to="'../message/message?id=' + one.id + '&readFlag=' + one.readFlag + '&refId=' + one.refId"
			>
				<view class="chat-custom-right">
					<text class="chat-custom-text">{{ one.sendTime }}</text>
				</view>
			</uni-list-chat>
		</uni-list>
	</view>
</template>

<script>
import uniList from '@/components/uni-list/uni-list.vue';
import uniListItem from '@/components/uni-list-item/uni-list-item.vue';
export default {
	components: {
		uniList,
		uniListItem
	},
	data() {
		return {
			page: 1,
			length: 20,
			list: [
			],
			isLastPage: false
		};
	},
	// 显示页面的时候加载第一页数据
	onShow: function() {
		this.page = 1;
		this.isLastPage = false;
		uni.pageScrollTo({
			// 移动到页面顶部
			scrollTop: '0'
		});
		this.loadMessageList();
	},
	// 当用户上划页面触底之后，触发翻页事件的回调函数
	onReachBottom: function() {
		if (this.isLastPage) {
			return;
		}
		this.page = this.page + 1;
		this.loadMessageList();
	},
	methods: {
		loadMessageList: function() {
			let that = this;
			let data = {
				page: that.page,
				length: that.length
			};
			that.ajax(that.url.searchMessageByPage, 'POST', data, function(resp) {
				let result = resp.data.result;
				if (result == null || result.length == 0) {
					that.isLastPage = true;
					that.page = that.page - 1;
					uni.showToast({
						icon: 'none',
						title: '已经到底了'
					});
				} else {
					if (that.page == 1) {
						that.list = [];
					}
					// 数组合并
					that.list = that.list.concat(result);
					if (that.page > 1) {
						uni.showToast({
							icon: 'none',
							title: '又加载了' + result.length + '条消息'
						});
					}
				}
			});
		}
	}
};
</script>

<style lang="less">
@import url('message_list.less');
</style>
