<template>
	<!-- 打卡日历页面 -->
	<view class="all">
		<view class="bar">
			<!-- 上一个月 -->
			<view class="previous" @click="handleCalendar(0)">
				<button class="barbtn" v-if="langType == 'ch'">上一月</button>
				<button class="barbtn" v-else>Last</button>
			</view>
			<!-- 显示年月 -->
			<view class="date">{{ cur_year || '--' }} 年 {{ cur_month || '--' }} 月</view>
			<!-- 下一个月 -->
			<view class="next" @click="handleCalendar(1)">
				<button class="barbtn" v-if="langType == 'ch'">下一月</button>
				<button class="barbtn" v-else>Next</button>
			</view>
		</view>
		<!-- 显示星期 -->
		<view class="week" v-if="langType == 'ch'">
			<view v-for="(item, index) in weeks_ch" :key="index">{{ item }}</view>
		</view>
		<view class="week" v-else>
			<view v-for="(item, index) in weeks_en" :key="index">{{ item }}</view>
		</view>
		<view class="myDateTable">
			<view v-for="(item, j) in days" :key="j" class="dateCell">
				<view class="cell" v-if="item.date == undefined || item.date == null"><text :decode="true">&nbsp;&nbsp;</text></view>
				<view v-else>
					<view class="cell whiteColor bgBlue" @click="cancelHoliday(j)" v-if="item.isHoliday == true"><text>放假</text></view>
					<view class="cell whiteColor bgBlue" @click="cancelWorkday(j)" v-else-if="item.isWorkday == true"><text>工作</text></view>
					<!-- 或者周一到周五备注为“假期”亦显示"红色" -->
					<!-- 默认 周六周天 显示"红色" -->
					<view class="cell redColor bgGray" @click="toWorkday(j)" v-else-if="j % 7 === 6 || j % 7 === 0">
						<text>{{ item.date }}</text>
					</view>
					<!-- 或者周六到周天备注为“调整”亦显示"绿色" -->
					<!-- 周一到周五 显示"绿色" -->
					<view class="cell greenColor bgWhite" @click="toHoliday(j)" v-else>
						<text>{{ item.date }}</text>
					</view>
				</view>
			</view>
		</view>
		<view class="TipArea ">
			Tip:
			<p>
				默认工作日为绿色字体，休息日为红色字体。节假日等日程安排请点击日期修改！
				<!-- <view class="impTip">同步数据给数据库，切换月或重新进入</view> -->
				<!-- 页面再向数据库读取记录(不会的建议参考我的Demo,而不是单独下个组件过来瞎折腾)。本地打卡不做任何记录， -->
				<!-- <view class="impTip">仅仅模拟成功</view> -->
			</p>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			days: [],
			workdays: [],
			holidays: [],
			cur_year: 0, //当前选的年
			cur_month: 0, //当前选的月
			today: parseInt(new Date().getDate()), //本日
			toMonth: parseInt(new Date().getMonth() + 1), //本月
			toYear: parseInt(new Date().getFullYear()), //本年
			weeks_ch: ['日', '一', '二', '三', '四', '五', '六'],
			weeks_en: ['Sun', 'Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat']
		};
	},
	props: {
		sendYear: {
			type: Number,
			default: new Date().getFullYear()
		},
		sendMonth: {
			type: Number,
			default: new Date().getMonth() + 1
		},
		workdaysData: {
			//工作的数据源
			type: Array,
			default: () => {
				return [];
			}
		},
		holidaysData: {
			//放假的数据源
			type: Array,
			default: () => {
				return [];
			}
		},
		langType: {
			//只是示例一个翻译而已，要想所有都翻译自己可以再加加
			type: String,
			default: 'ch'
		}
	},
	created() {
		this.cur_year = this.sendYear;
		this.cur_month = this.sendMonth;
		this.holidays = this.holidaysData;
		this.workdays = this.workdaysData;
		this.calculateEmptyGrids(this.cur_year, this.cur_month);
		this.calculateDays(this.cur_year, this.cur_month);
	},
	watch: {
		holidaysData: 'onHolidaysChange',
		workdaysData: 'onWorkdaysChange'
	},
	methods: {
		judgeCanEdit(j) {
			let tag = true;
			if (this.cur_year < this.toYear) {
				//no
				tag = false;
			} else if (this.cur_year == this.toYear) {
				//本年
				if (this.cur_month < this.toMonth) {
					//no
					tag = false;
				} else if (this.cur_month == this.toMonth) {
					//本月
					if (this.days[j].date < this.today) {//todo <=
						//no
						tag = false;
					}
				}
			}
			if (!tag) {
				uni.showToast({
					icon: 'none',
					title: '无法修改当前日期及以前的日程安排'
				});
			}
			return tag;
		},
		onHolidaysChange(newD, oldD) {
			this.holidays = newD;
			this.onJudgeHolidays();
		},
		onWorkdaysChange(newD, oldD) {
			this.workdays = newD;
			this.onJudgeWorkdays();
		},
		cancelHoliday(j) {
			if (this.judgeCanEdit(j)) {
				this.days[j].isHoliday = false;
				this.$emit('holidayChange', this.cur_year + '-' + this.cur_month + '-' + this.days[j].date, 'delete');
			}
		},
		cancelWorkday(j) {
			if (this.judgeCanEdit(j)) {
				this.days[j].isWorkday = false;
				this.$emit('workdayChange', this.cur_year + '-' + this.cur_month + '-' + this.days[j].date, 'delete');
			}
		},
		toWorkday(j) {
			if (this.judgeCanEdit(j)) {
				this.days[j].isWorkday = true;
				this.$emit('workdayChange', this.cur_year + '-' + this.cur_month + '-' + this.days[j].date, 'add');
			}
		},
		toHoliday(j) {
			if (this.judgeCanEdit(j)) {
				this.days[j].isHoliday = true;
				this.$emit('holidayChange', this.cur_year + '-' + this.cur_month + '-' + this.days[j].date, 'add');
			}
		},
		// 获取当月共多少天
		getThisMonthDays(year, month) {
			return new Date(year, month, 0).getDate();
		},
		// 获取当月第一天星期几
		getFirstDayOfWeek(year, month) {
			return new Date(Date.UTC(year, month - 1, 1)).getDay();
		},
		// 计算当月1号前空了几个格子，把它填充在days数组的前面
		calculateEmptyGrids(year, month) {
			//计算每个月时要清零
			this.days = [];
			const firstDayOfWeek = this.getFirstDayOfWeek(year, month);
			if (firstDayOfWeek > 0) {
				for (let i = 0; i < firstDayOfWeek; i++) {
					var obj = {
						date: null,
						isHoliday: false,
						isWorkday: false
					};
					this.days.push(obj);
				}
			}
		},

		// 绘制当月天数占的格子，并把它放到days数组中
		calculateDays(year, month) {
			const thisMonthDays = this.getThisMonthDays(year, month);
			for (let i = 1; i <= thisMonthDays; i++) {
				var obj = {
					date: i,
					isHoliday: false,
					isWorkday: false
				};
				this.days.push(obj);
			}
		},

		onJudgeHolidays() {
			var holidays = this.holidays;
			var daysArr = this.days;
			for (var i = 0; i < holidays.length; i++) {
				var current = new Date(holidays[i].replace(/-/g, '/'));
				var year = current.getFullYear();
				var month = current.getMonth() + 1;
				var day = current.getDate();
				day = parseInt(day);
				for (var j = 0; j < daysArr.length; j++) {
					//年月日相同则为假期
					if (year == this.cur_year && month == this.cur_month && daysArr[j].date == day) {
						console.log(daysArr[j].date, day);
						daysArr[j].isHoliday = true;
					}
				}
			}
			this.days = daysArr;
		},
		onJudgeWorkdays() {
			var workdays = this.workdays;
			var daysArr = this.days;
			for (var i = 0; i < workdays.length; i++) {
				var current = new Date(workdays[i].replace(/-/g, '/'));
				var year = current.getFullYear();
				var month = current.getMonth() + 1;
				var day = current.getDate();
				day = parseInt(day);
				for (var j = 0; j < daysArr.length; j++) {
					//年月日相同则为工作
					if (year == this.cur_year && month == this.cur_month && daysArr[j].date == day) {
						console.log(daysArr[j].date, day);
						daysArr[j].isWorkday = true;
					}
				}
			}
			this.days = daysArr;
		},

		// 切换控制年月，上一个月，下一个月
		handleCalendar(type) {
			const cur_year = parseInt(this.cur_year);
			const cur_month = parseInt(this.cur_month);
			var newMonth;
			var newYear = cur_year;
			if (type === 0) {
				//上个月
				newMonth = cur_month - 1;
				if (newMonth < 1) {
					newYear = cur_year - 1;
					newMonth = 12;
				}
			} else {
				newMonth = cur_month + 1;
				if (newMonth > 12) {
					newYear = cur_year + 1;
					newMonth = 1;
				}
			}
			this.calculateEmptyGrids(newYear, newMonth);
			this.calculateDays(newYear, newMonth);

			this.cur_year = newYear;
			this.cur_month = newMonth;

			this.$emit('dateChange', this.cur_year, this.cur_month); //传给调用模板页面去拿新数据
		}
	}
};
</script>

<style>
.all {
	margin-top: 20rpx;
}

.all .bar {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	margin: 30rpx 20rpx;
	padding: 10rpx;
}

.bar .barbtn {
	height: 30px;
	line-height: 30px;
	font-size: 12px;
}

.all .week {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	padding: 20rpx;
	padding-left: 40rpx;
	padding-right: 40rpx;
	margin: 20rpx;
	border-radius: 10px;
	background-color: #fff;
}
.myDateTable {
	margin: 2.5vw;
	padding: 2vw;
	border-radius: 10px;
	background: linear-gradient(#74aada, #94db98);
}
.myDateTable .dateCell {
	width: 11vw;
	padding: 1vw;
	display: inline-block;
	text-align: center;
	font-size: 16px;
}

.dateCell .cell {
	display: flex;
	border-radius: 50%;
	height: 11vw;
	justify-content: center;
	align-items: center;
}

.whiteColor {
	color: #fff;
}

.greenColor {
	color: #01b90b;
	font-weight: bold;
}

.bgWhite {
	background-color: #fff;
}

.bgGray {
	background-color: rgba(255, 255, 255, 0.42);
}

.bgBlue {
	font-size: 14px;
	background-color: #4b95e6;
}

.redColor {
	color: #ff0000;
}

.TipArea {
	word-break: break-all;
	word-wrap: break-word;

	font-size: 14px;
	padding: 10px;
}
.impTip {
	display: inline-block;
	color: #ff0000;
}
</style>
