<template>
	<view class="page" v-if="checkPermission(['ROOT', 'ROLE:SELECT'])">
		<view class="list">
			<view class="item" v-for="one in list" :key="one.id" @longpress="deleteRole(one.id, one.roleName)" @tap="toRolePage(one.id)">
				<text class="key">{{ one.roleName }}</text>
				<image src="../../static/icon-2.png" mode="widthFix" class="icon"></image>
			</view>
		</view>
		<button class="btn" @tap="insertRole" v-if="checkPermission(['ROOT', 'ROLE:INSERT'])">添加</button>
		<uni-popup ref="popupRole" type="dialog">
			<uni-popup-dialog mode="input" title="编辑角色名称" :value="roleName" placeholder="输入角色名称" @confirm="finishRole"></uni-popup-dialog>
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
			roleName: ''
		};
	},
	onShow: function() {
		this.loadRoleList();
	},
	methods: {
		loadRoleList(){
			let that = this;
			that.ajax(that.url.searchAllRole, 'POST', {}, function(resp) {
				let result = resp.data.result;
				that.list = result
			});
		},
		toRolePage: function(id) {
			if(this.checkPermission(['ROOT', 'ROLE:UPDATE', 'ROLE:DELETE'])){
				if(id == 0) {
					uni.showToast({
						icon: 'none',
						title: '超级管理员具有全部权限且无法修改',
					})
					return
				}
				uni.navigateTo({
					url: '../role/role?id=' + id + '&opt=edit'
				});
			} else {
				uni.showToast({
					icon: 'none',
					title: '您不具备相关权限'
				});
			}
		},
		insertRole: function() {
			if(this.checkPermission(['ROOT', 'ROLE:INSERT'])){
				this.$refs.popupRole.open()	
			} else {
				uni.showToast({
					icon: 'none',
					title: '您不具备相关权限'
				});
			}
		},
		finishRole: function(done, value) {
			//判断是否为空 以及角色是否已经存在
			if(!this.checkBlank(value, "角色名称")){
				this.roleName = value;
				done()
				uni.navigateTo({
					url: '../role/role?roleName=' + value + '&opt=insert'
				});
				// let that = this;
				// that.ajax(that.url.insertRole, 'POST', {}, function(resp) {
				// 	let result = resp.data.result;
				// 	that.list = result
				// });
			}
		},
		deleteRole(id){
			if(this.checkPermission(['ROOT', 'ROLE:DELETE'])){
				
			} else {
				uni.showToast({
					icon: 'none',
					title: '您不具备相关权限'
				});
			}
		}
		
	}
};
</script>

<style lang="less">
@import url('role_list.less');
</style>
