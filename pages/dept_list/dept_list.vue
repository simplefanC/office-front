<template>
	<view class="page" v-if="checkPermission(['ROOT', 'DEPT:SELECT'])">
		<view class="list">
			<view class="item" v-for="one in list" :key="one.id" @longpress="deleteDept(one.id, one.deptName)" @tap="editDept(one.id, one.deptName)">
				<text class="key">{{ one.deptName }}</text>
				<!-- <image src="../../static/icon-2.png" mode="widthFix" class="icon"></image> -->
				<image src="../../static/icon-18.png" mode="widthFix" class="icon"></image>
			</view>
		</view>
		<button class="btn" @tap="insertDept" v-if="checkPermission(['ROOT', 'DEPT:INSERT'])">添加</button>
		<uni-popup ref="popupDept" type="dialog">
			<uni-popup-dialog mode="input" title="编辑部门名称" :value="deptName" placeholder="输入部门名称" @confirm="finishDept"></uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script>
import uniPopup from '@/components/uni-popup/uni-popup.vue';
import uniPopupMessage from '@/components/uni-popup/uni-popup-message.vue';
import uniPopupDialog from '@/components/uni-popup/uni-popup-dialog.vue';
export default {
	components: {
		uniPopup,
		uniPopupMessage,
		uniPopupDialog
	},
	data() {
		return {
			list: [],
			id: 0,
			deptName: '',
			deptNameList: []
		};
	},
	onShow: function() {
		this.loadDeptList();
	},
	methods: {
		loadDeptList(){
			let that = this;
			that.deptNameList = []
			that.ajax(that.url.searchAllDept, 'POST', {}, function(resp) {
				let result = resp.data.result;
				that.list = result
				that.list.forEach(el=>that.deptNameList.push(el.deptName))
			});
		},
		editDept: function(id, deptName) {
			if(this.checkPermission(['ROOT', 'DEPT:UPDATE'])){
				this.id = id;
				this.deptName = deptName;
				this.$refs.popupDept.open()
			} else {
				uni.showToast({
					icon: 'none',
					title: '您不具备修改权限'
				});
			}
		},
		insertDept: function() {
			this.id = '';
			this.deptName = '';
			this.$refs.popupDept.open()
		},
		deleteDept: function(id, deptName) {
			if(this.checkPermission(['ROOT', 'DEPT:DELETE'])){
				//判断角色下面是否有员工
				//使手机发生较短时间的振动
				let that = this
				uni.vibrateShort({});
				uni.showModal({
					title: '提示信息',
					content: '是否删除这个部门？',
					success: function(resp) {
						if (resp.confirm) {
							// 判断该部门下是否有员工
							that.ajax(that.url.deleteDeptById, 'POST', {id : id}, function(resp) {
								let result = resp.data.result;
								uni.showToast({
									icon: 'none',
									title: '删除成功'
								})
								that.loadDeptList();
							});
						}
					}
				});
			} else {
				uni.showToast({
					icon: 'none',
					title: '您不具备删除权限'
				});
			}
		},
		finishDept: function(done, value) {
			if(this.deptName == value){
				done()
				return
			}
			//判断是否为空 以及部门是否已经存在
			if(!this.checkBlank(value, "部门名称")){
				if(this.deptNameList.includes(value)){
					uni.showToast({
						icon: 'none',
						title: '已存在该部门'
					})
					done()
					return
				}
				//ajax
				let that = this;
				if(that.id){
					that.ajax(that.url.updateDept, 'POST', {id: that.id, deptName: value}, function(resp) {
						let result = resp.data.result;
						//提示成功
						uni.showToast({
							icon: 'none',
							title: '修改成功'
						})
						that.loadDeptList();
					});
				} else {
					that.ajax(that.url.insertDept, 'POST', {deptName: value}, function(resp) {
						let result = resp.data.result;
						uni.showToast({
							icon: 'none',
							title: '添加成功'
						})
						that.loadDeptList();
					});
				}
				done()
			}
		},
		
		
	}
};
</script>

<style lang="less">
@import url('dept_list.less');
</style>
