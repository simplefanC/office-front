<template>
	<view class="page" v-if="checkPermission(['ROOT', 'EMPLOYEE:SELECT'])">
		<view class="add" v-if="checkPermission(['ROOT', 'EMPLOYEE:INSERT'])" @tap="toEmployPage(null)">
			<image src="../../static/icon-17.png" mode="widthFix" class="icon"></image>
			<text>添加员工</text>
		</view>
		<checkbox-group @change="selected">
			<block v-for="dept in list" :key="dept.id">
				<view class="list-title">{{ dept.deptName }}（{{ dept.count }}人）</view>
				<view class="item" v-for="member in dept.members" :key="member.userId" @tap="toEmployPage(member.userId)">
					<view class="key">{{ member.name }}</view>
					<image src="../../static/icon-2.png" mode="widthFix" class="icon"></image>
					<!-- <checkbox class="value" :value="member.userId" :checked="member.checked"></checkbox> -->
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
			this.deptId = options.deptId;
			this.roleId = options.roleId;
		},
		onShow: function() {
		    this.loadData();
		},
		methods: {
			toEmployPage(userId) {
				if(!this.checkPermission(['ROOT', 'EMPLOYEE:INSERT', 'EMPLOYEE:UPDATE', 'EMPLOYEE:DELETE'])){
					uni.showToast({
						icon: 'none',
						title: '您不具备相关权限'
					});
					return;
				}
				if(!userId){
					uni.navigateTo({
						url: '../employee/employee?opt=add&deptId='+this.deptId+"&roleId="+this.roleId
					});
					return
				}
				let that = this;
				that.ajax(that.url.searchUserSummary, 'GET', {userId: userId}, function(resp) {
					let result = resp.data.result;
					uni.navigateTo({
						url: '../employee/employee?opt=list&employee=' + encodeURIComponent(JSON.stringify(result))
					});
					// that.name = result.name;
					// that.deptName = result.deptName;
					// that.photo = result.photo;
				});

			},
			loadData: function() {
				let that = this;
			    that.ajax(that.url.searchUserGroupByDept, 'POST', { keyword: that.keyword, roleId: that.roleId, deptId: that.deptId }, function(resp) {
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
    @import url("employee_list.less");
</style>
