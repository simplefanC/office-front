<template>
	<view class="page" v-if="checkPermission(['ROOT', 'ROLE:SELECT'])">
		<view v-for="one in list" :key="one.moduleName">
			<view class="list-title">{{ one.moduleName }}</view>
			<uni-list v-if="one.action.length > 0">
				<uni-list-item
					v-for="action in one.action"
					:title="action.actionName"
					:key="action.id"
					:show-switch="true"
					:switchChecked="action.selected"
					@switchChange="switchChange"
					:dataId="action.id"
				></uni-list-item>
			</uni-list>
		</view>
		<button class="btn" @tap="save" v-if="checkPermission(['ROOT', 'ROLE:INSERT', 'ROLE:UPDATE'])">保存</button>
		<button class="btn" @tap="deleteRole()" v-if="checkPermission(['ROOT', 'ROLE:DELETE'])" style="background-color: #ed5e68;">删除</button>
	</view>
</template>

<script>
	import uniList from '@/components/uni-list/uni-list.vue';
	import uniListItem from '@/components/uni-list-item/uni-list-item.vue';
	import uniPopup from '@/components/uni-popup/uni-popup.vue';
	export default {
		components: {
			uniList,
			uniListItem
		},
		data() {
			return {
				opt: null, //URL传参，insert代表新增，edit代表修改
				roleName: null, //URL传参，如果opt是edit，需要根据角色名字查找该角色的权限
				list: [
				],
				id: 0,
				selected: {}
			};
		},
		onShow: function() {
		    let that = this;
		    let url;
		    let method;
		    if (that.opt == 'insert') {
		        url = that.url.searchAllPermission;
		        method = 'GET';
		    } else {
		        url = that.url.searchRoleOwnPermission;
		        method = 'POST';
		    }
		    that.ajax(url,method,{"id":that.id},function(resp){
		        that.list = resp.data.result;
		        for (let one of that.list) {
		            for (let action of one.action) {
		                //把角色具有的权限保存到selected里面
		                if (action.selected == true) {
		                    that.selected[action.id] = true;
		                }
		            }
		        }
		    })
		},
		onLoad: function(options) {
		    this.opt = options.opt;
		    if (options.hasOwnProperty('roleName')) {
		        this.roleName = options.roleName;
		    }
		    if (options.hasOwnProperty('id')) {
		        this.id = options.id;
		    }
		},
		methods: {
			deleteRole: function() {
				let that = this
				uni.showModal({
					title: '提示信息',
					content: '是否删除这个角色？',
					success: function(resp) {
						if (resp.confirm) {
							//成功删除后跳转到list页
							that.ajax(that.url.deleteRoleById, 'POST', {id : that.id}, function(resp) {
								let result = resp.data.result;
								uni.showToast({
									icon: 'none',
									title: '删除成功',
									complete: function() {
										setTimeout(function() {
											uni.navigateBack({});
										}, 2000);
									}
								})
							});
						}
					}
				});
			},
			switchChange: function(e) {
			    let id = e.target.dataset.id;
			    if (e.detail.value) {
			        this.selected[id] = true;
			    } else {
			        delete this.selected[id];
			    }
			},
			save: function() {
			    let that = this;
			    let url;
			    if (that.opt == 'insert') {
			        url = that.url.insertRole;
			    } else {
			        url = that.url.updateRolePermissions;
			    }
			    let data = {
			        id: that.id,
			        roleName: that.roleName,
			        permissions: "["+Object.keys(that.selected)+"]"
			    };
			    that.ajax(url, 'POST', data, function(resp) {
			        uni.showToast({
			            icon: 'success',
			            title: '保存成功',
			            complete: function() {
			                setTimeout(function() {
			                    uni.navigateBack({
			                        delta: 1
			                    });
			                }, 2000);
			            }
			        });
			    });
			}
		}
	}
</script>

<style lang="less">
    @import url("role.less");
</style>
