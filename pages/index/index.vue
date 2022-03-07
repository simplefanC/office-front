<template>
	<view class="page">
		<!-- 轮播焦点图 -->
		<swiper circular="true" interval="8000" duration="1000" class="swiper">
			<swiper-item><image mode="widthFix" src="https://static-1258386385.cos.ap-beijing.myqcloud.com/img/banner/swiper-1.jpg"></image></swiper-item>
			<swiper-item><image mode="widthFix" src="https://static-1258386385.cos.ap-beijing.myqcloud.com/img/banner/swiper-2.jpg"></image></swiper-item>
			<swiper-item><image mode="widthFix" src="https://static-1258386385.cos.ap-beijing.myqcloud.com/img/banner/swiper-3.jpg"></image></swiper-item>
			<swiper-item><image mode="widthFix" src="https://static-1258386385.cos.ap-beijing.myqcloud.com/img/banner/swiper-4.jpg"></image></swiper-item>
			<swiper-item><image mode="widthFix" src="https://static-1258386385.cos.ap-beijing.myqcloud.com/img/banner/swiper-5.jpg"></image></swiper-item>
		</swiper>
		<!-- 通知栏 -->
		<!-- 父控件相对定位 -->
		<view class="notify-container" @tap="toPage('消息提醒', '/pages/message_list/message_list')">
			<view class="notify-title">
				<image src="../../static/icon-1.png" mode="widthFix" class="notify-icon"></image>
				消息提醒
			</view>
			<view class="notify-content">你有{{ unreadRows }}条未读消息</view>
			<!-- 绝对定位 移动图标位置 -->
			<image src="../../static/icon-2.png" mode="widthFix" class="more-icon"></image>
		</view>
		<!-- 栏目导航 -->
		<view class="nav-container">
			<view class="nav-row">
				<view class="nav" @tap="toPage('在线签到', '../checkin/checkin')">
					<image mode="widthFix" src="../../static/nav-1.png" class="icon"></image>
					<text class="name">在线签到</text>
				</view>
				<view class="nav">
					<image src="../../static/nav-2.png" mode="widthFix" class="icon"></image>
					<text class="name">员工健康</text>
				</view>
				<view class="nav">
					<image src="../../static/nav-3.png" mode="widthFix" class="icon"></image>
					<text class="name">在线请假</text>
				</view>
				<view class="nav">
					<image src="../../static/nav-4.png" mode="widthFix" class="icon"></image>
					<text class="name">公务出差</text>
				</view>
			</view>
			<view class="nav-row">
				<view class="nav">
					<image src="../../static/nav-5.png" mode="widthFix" class="icon"></image>
					<text class="name">员工日报</text>
				</view>
				<view class="nav">
					<image src="../../static/nav-6.png" mode="widthFix" class="icon"></image>
					<text class="name">我的加班</text>
				</view>
<!-- 				<view class="nav">
					<image src="../../static/nav-7.png" mode="widthFix" class="icon"></image>
					<text class="name">付款申请</text>
				</view> -->
				<view class="nav" @tap="toPage('日程安排', '../schedule/schedule')">
					<image src="../../static/schedule.png" mode="widthFix" class="icon"></image>
					<text class="name">日程安排</text>
				</view>
				<view class="nav">
					<image src="../../static/nav-8.png" mode="widthFix" class="icon"></image>
					<text class="name">费用报销</text>
				</view>
			</view>
			<view class="nav-row">
				<view class="nav">
					<image src="../../static/nav-9.png" mode="widthFix" class="icon"></image>
					<text class="name">公告通知</text>
				</view>
				<view class="nav" @tap="toPage('在线审批', '../approval_list/approval_list')">
					<image src="../../static/nav-10.png" mode="widthFix" class="icon"></image>
					<text class="name">在线审批</text>
				</view>
				<view class="nav">
					<image src="../../static/nav-11.png" mode="widthFix" class="icon"></image>
					<text class="name">物品领用</text>
				</view>
	<!-- 			<view class="nav">
					<image src="../../static/nav-12.png" mode="widthFix" class="icon"></image>
					<text class="name">采购申请</text>
				</view> -->
				<view class="nav" @tap="toPage('系统配置', '../system_config/system_config')">
					<image src="../../static/nav-config.png" mode="widthFix" class="icon"></image>
					<text class="name">系统配置</text>
				</view>
			</view>
		</view>

		<view class="calendar-container"><uni-calendar :insert="true" :lunar="true" :selected="calendar" @monthSwitch="changeMonth" /></view>
		<view class="meeting-container" v-for="one in meetingList" :key="one.id">
			<view class="meeting">
				<view class="row">
					<text class="title">{{ one.title }}</text>
					<text class="hours">时长：{{ one.hour == 0 ? 1 : one.hour }}小时</text>
				</view>
				<view class="row">
					<image src="../../static/icon-3.png" mode="widthFix" class="icon"></image>
					<text class="desc" space="emsp">日期：{{ one.date }} {{ one.start }}</text>
				</view>
				<view class="row">
					<image src="../../static/icon-4.png" mode="widthFix" class="icon"></image>
					<text class="desc">地点：{{ one.type == '线上会议' ? one.type : one.place }}</text>
				</view>
				<image :src="one.photo" class="photo"></image>
			</view>
		</view>

		<!-- 气泡消息标签 -->
		<uni-popup ref="popupMsg" type="top">
			<!-- 2秒自动消失 -->
			<uni-popup-message type="success" :message="'接收到' + lastRows + '条消息'" :duration="2000" />
		</uni-popup>
	</view>
</template>

<script>
import uniPopup from '@/components/uni-popup/uni-popup.vue';
import uniPopupMessage from '@/components/uni-popup/uni-popup-message.vue';
import uniPopupDialog from '@/components/uni-popup/uni-popup-dialog.vue';
import uniCalendar from '@/components/uni-calendar/uni-calendar.vue';

export default {
	components: {
		// 引入气泡消息控件
		uniPopup,
		uniPopupMessage,
		uniPopupDialog,
		uniCalendar
	},
	data() {
		return {
			timer: null,
			unreadRows: 0,
			lastRows: 0,
			calendar: [{ date: '2021-02-15', info: '会议' }, { date: '2021-02-16', info: '会议' }, { date: '2021-02-17', info: '会议' }],
			meetingPage: 1,
			meetingLength: 20,
			meetingList: [
				{
					id: 1,
					title: '测试会议1',
					hour: 4,
					date: '2021/02/20',
					start: '08:50',
					type: '线上会议',
					photo: 'https://static-1258386385.cos.ap-beijing.myqcloud.com/img/header/070920192833.jpg'
				},
				{
					id: 2,
					title: '测试会议2',
					hour: 4,
					date: '2021/02/20',
					start: '08:50',
					type: '线上会议',
					photo: 'https://static-1258386385.cos.ap-beijing.myqcloud.com/img/header/070920192833.jpg'
				},
				{
					id: 3,
					title: '测试会议3',
					hour: 4,
					date: '2021/02/20',
					start: '08:50',
					type: '线上会议',
					photo: 'https://static-1258386385.cos.ap-beijing.myqcloud.com/img/header/070920192833.jpg'
				},
				{
					id: 4,
					title: '测试会议4',
					hour: 4,
					date: '2021/02/20',
					start: '08:50',
					type: '线上会议',
					photo: 'https://static-1258386385.cos.ap-beijing.myqcloud.com/img/header/070920192833.jpg'
				},
				{
					id: 5,
					title: '测试会议5',
					hour: 4,
					date: '2021/02/20',
					start: '08:50',
					type: '线上会议',
					photo: 'https://static-1258386385.cos.ap-beijing.myqcloud.com/img/header/070920192833.jpg'
				}
			],
			isMeetingLastPage: false
		};
	},
	// 页面生命周期中 只会执行一次
	onLoad: function() {
		// 监听事件
		let that = this;
		uni.$on('showMessage', function() {
			// 弹出气泡消息
			that.$refs.popupMsg.open();
		});
		// 登录立即接收消息
		that.ajax(that.url.refreshMessage, 'GET', null, function(resp) {
			that.unreadRows = resp.data.unreadRows;
			that.lastRows = resp.data.lastRows;
			if (that.lastRows > 0) {
				// 触发事件
				uni.$emit('showMessage');
			}
		});
	},
	// 小程序关闭时触发
	onUnload: function() {
		// 移除监听事件
		uni.$off('showMessage');
	},
	onReachBottom: function() {
		if (this.isMeetingLastPage) {
			return;
		}
		this.meetingPage = this.meetingPage + 1;
		this.loadMeetingList(this);
	},
	// 页面一显示触发
	onShow: function() {
		let that = this;
		// 定时器：5s发一次轮训请求 上线时可设置为5分钟
		that.timer = setInterval(function() {
			that.ajax(that.url.refreshMessage, 'GET', null, function(resp) {
				that.unreadRows = resp.data.unreadRows;
				that.lastRows = resp.data.lastRows;
				if (that.lastRows > 0) {
					// 触发事件
					uni.$emit('showMessage');
				}
			});
		}, 5 * 1000);
		that.meetingPage = 1;
		that.isMeetingLastPage = false;
		that.meetingList = [];
		//加载分页会议列表
		that.loadMeetingList(that);
		//加载本月会议日期
		let date = new Date();
		that.loadMeetingInMonth(that, date.getFullYear(), date.getMonth() + 1);
	},
	onHide: function() {
		clearInterval(this.timer);
	},
	methods: {
		toPage: function(name, url) {
			// 验证用户权限
			if (name == '在线审批') {
				let flag = this.checkPermission(['ROOT','WORKFLOW:APPROVAL']);
				if (!flag) {
					uni.showToast({
						icon: 'none',
						title: '您不具备相关权限'
					});
					return;
				}
			} else if(name == '系统配置'){
				let flag = this.checkPermission(['ROOT','CONFIGURATION:UPDATE']);
				if (!flag) {
					uni.showToast({
						icon: 'none',
						title: '您不具备相关权限'
					});
					return;
				}
			} else if(name == '日程安排'){
				let flag = this.checkPermission(['ROOT','SCHEDULE:UPDATE']);
				if (!flag) {
					uni.showToast({
						icon: 'none',
						title: '您不具备相关权限'
					});
					return;
				}
			}
			uni.navigateTo({
				url: url
			});
		},
		loadMeetingList: function(ref) {
			let data = {
				page: ref.meetingPage,
				length: ref.meetingLength
			};
			ref.ajax(ref.url.searchMyMeetingListByPage, 'POST', data, function(resp) {
				let result = resp.data.result;
				if (result == null || result.length == 0) {
					ref.isMeetingLastPage = true;
					ref.meetingPage = ref.meetingPage - 1;
					if (ref.meetingPage > 1) {
						uni.showToast({
							icon: 'none',
							title: '已经到底了'
						});
					}
				} else {
					let list = [];
					for (let one of result) {
						for (let meeting of one.list) {
							if (meeting.type == 1) {
								meeting.type = '线上会议';
							} else if (meeting.type == 2) {
								meeting.type = '线下会议';
							}
							if (meeting.status == 3) {
								meeting.status = '未开始';
							} else if (meeting.status == 4) {
								meeting.status = '进行中';
							}
							list.push(meeting);
						}
					}
					ref.meetingList = list;
				}
			});
		},
		loadMeetingInMonth: function(ref, year, month) {
			let data = { year: year, month: month };
			ref.ajax(ref.url.searchUserMeetingInMonth, 'POST', data, function(resp) {
				ref.calendar = [];
				for (let one of resp.data.result) {
					ref.calendar.push({ date: one, info: '会议' });
				}
			});
		},
		changeMonth: function(e) {
			let that = this;
			let year = e.year;
			let month = e.month;
			that.loadMeetingInMonth(that, year, month);
		}
	}
};
</script>

<style lang="less">
@import url('index.less');
</style>
