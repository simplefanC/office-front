<template>
	<view>
		<model-calendar :sendYear="toYear" :sendMonth="toMonth" 
		:holidaysData="holidays"
		:workdaysData="workdays"
		@dateChange="searchScheduleInMonth" 
		@workdayChange="workdayChange"
		@holidayChange="holidayChange"
		>
		</model-calendar>
	</view>
</template>

<script>
import modelCalendar from './Calendar.vue';

export default {
	components: {
		modelCalendar
	},
	data() {
		return {
			toYear: parseInt(new Date().getFullYear()), //本年
			toMonth: parseInt(new Date().getMonth() + 1), //本月
			holidays: [
			],
			workdays: [
			]
		};
	},
	onShow(){
		this.searchScheduleInMonth(this.toYear, this.toMonth);
	},
	created() {
		//获取当前用户当前任务的签到状态
		// this.getData(this.toYear + '-' + this.toMonth);
		// this.searchScheduleInMonth();
	},
	methods: {
		searchScheduleInMonth(year, month){
			console.log("search", year, month)
			let that = this
			that.ajax(that.url.searchScheduleInMonth, 'POST', {year: year, month: month}, function(resp) {
				that.holidays = resp.data.holidays
				that.workdays = resp.data.workdays
			});
		},
		workdayChange(date, type){
			console.log("workday", date, type)
			let that = this
			that.ajax(that.url.addOrDeleteWorkday, 'POST', {date: date, type: type}, function(resp) {
				let result = resp.data.result;
			});
		},
		holidayChange(date, type){
			console.log("holiday", date, type)
			let that = this
			that.ajax(that.url.addOrDeleteHoliday, 'POST', {date: date, type: type}, function(resp) {
				let result = resp.data.result;
			});
		}
	}
};
</script>

<style lang="scss">
.count .daynumber {
	display: flex;
	flex-direction: row;
	justify-content: center;
}

.count .daynumber .day {
	margin-top: 50rpx;
}

.count {
	margin: 20rpx;
	padding: 30rpx;
	display: flex;
	text-align: center;
	border-radius: 10px;
	flex-direction: column;
	justify-content: center;
	background-color: #fff;
	align-items: center;
}

.count .number {
	color: #fff;
	font-size: 60rpx;
	background-color: #94db98;
	width: 100rpx;
	height: 100rpx;
	border-radius: 50%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	margin: 20rpx;
}

.monthSum {
	color: red;
	font-size: 40rpx;
}

.count text {
	margin: 10rpx;
}
</style>
