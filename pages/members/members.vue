<template>
	<view class="page">
		<checkbox-group @change="selected">
			<block v-for="dept in list" :key="dept.id">
				<view class="list-title">{{ dept.deptName }}（{{ dept.count }}人）</view>
				<view class="item" v-for="member in dept.members" :key="member.userId">
					<view class="key">{{ member.name }}</view>
					<checkbox class="value" :value="member.userId" :checked="member.checked"></checkbox>
				</view>
			</block>
		</checkbox-group>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: [
				],
				// 勾选的用户的id
				members: []
			}
		},
		onLoad: function(options) {
		    if (options.hasOwnProperty('members')) {
		        let members = options.members;
		        this.members = members.split(',');
		    }
		},
		onShow: function() {
		    this.loadData();
		},
		methods: {
			loadData: function() {
				let that = this;
			    that.ajax(that.url.searchUserGroupByDept, 'POST', { keyword: that.keyword }, function(resp) {
			        let result = resp.data.result;
			        that.list = result;
			        for (let dept of that.list) {
			            for (let member of dept.members) {
			                if (that.members.indexOf(member.userId + '') != -1) {
			                    member.checked = true;
			                } else {
			                    member.checked = false;
			                }
			            }
			        }
			    });
			},
			selected: function(e) {
			    this.members = e.detail.value; //当前所有选中的成员
			    let pages = getCurrentPages(); //当前页面栈
			    let prevPage = pages[pages.length - 2]; //上一个页面
			    //向上一个页面（会议详情meeting.vue页面）传递数据
			    prevPage.members = this.members;
			    prevPage.finishMembers = true;
			}
		}
	}
</script>

<style lang="less">
    @import url("members.less");
</style>
