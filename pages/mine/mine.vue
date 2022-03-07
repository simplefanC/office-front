<template>
	<view class="page">
		<view class="user-info">
			<view class="border-outer">
				<avatar
					selWidth="200px"
					selHeight="200px"
					fileType="png"
					:avatarSrc="user.photo"
					@upload="myUpload"
					quality="1"
					inner="true"
					avatarStyle="width:120px;height:120px;border-radius:50%;margin-top:4px;"
				></avatar>

				<!-- <cropper selWidth="660rpx" selHeight="660rpx" @upload="myUpload" :avatarSrc="user.photo" avatarStyle="width:120px;height:120px;border-radius:50%;margin-top:4px;"> </cropper> -->

				<!-- 配置 del-icon 属性为 false，隐藏删除按钮 -->
				<!-- 配置 limit 属性为 1 ，则最多选择一张图片 -->
				<!-- 配置 file-mediatype 属性为 image，限定只选择图片 -->
				<!-- <view class="border-outer"> -->
				<!-- :imageStyles="imageStyles" -->
				<!-- 				<view class="border-inner" v-if="canEdit">
					<uni-file-picker
					@success="success"
					limit="1" 
					:del-icon="false" 
					disable-preview 
					:imageStyles="imageStyles"
					file-mediatype="image">
					</uni-file-picker>
				</view>
				<view class="border-inner" @tap="editAvatar()" v-if="!canEdit">
					<image :src="user.photo" mode="widthFix" class="photo"></image>
				</view> -->
			</view>
			<view class="summary">
				<view>
					<text class="title">姓名</text>
					<text class="value">{{ user.name }}</text>
				</view>
				<view>
					<text class="title">部门</text>
					<text class="value">{{ user.deptName }}</text>
				</view>
				<view>
					<text class="title">角色</text>
					<text class="value">{{ user.roleName }}</text>
				</view>
			</view>
		</view>
		<view class="list-title">用户信息栏目</view>
		<uni-list>
			<!-- <navigator :url="'/pages/employee/employee?employee='+ encodeURIComponent(JSON.stringify(user))"> -->
			<uni-list-item title="个人资料" clickable link @click="toEmployPage"></uni-list-item>
			<!-- </navigator> -->
			<uni-list-item title="我的考勤" link to="/pages/my_checkin/my_checkin"></uni-list-item>
			<uni-list-item title="罚款记录" link to=""></uni-list-item>
		</uni-list>
		<view class="list-title">系统管理栏目</view>
		<uni-list>
			<uni-list-item title="员工管理" v-show="checkPermission(['ROOT', 'EMPLOYEE:UPDATE'])" clickable link @click="toEmployList"></uni-list-item>
			<uni-list-item title="部门管理" v-show="checkPermission(['ROOT', 'DEPT:UPDATE'])" link to="/pages/dept_list/dept_list"></uni-list-item>
			<uni-list-item title="权限管理" v-show="checkPermission(['ROOT', 'ROLE:UPDATE'])" link to="/pages/role_list/role_list"></uni-list-item>
		</uni-list>
		<button class="btn" @tap="logout">切换账号</button>
	</view>
</template>

<script>
import uniList from '@/components/uni-list/uni-list.vue';
import uniListItem from '@/components/uni-list-item/uni-list-item.vue';
// import cropper from "@/components/lxiaoxiao-cropper/lxiaoxiao-cropper.vue";
import avatar from '@/components/yq-avatar/yq-avatar.vue';
export default {
	components: {
		uniList,
		uniListItem,
		// cropper
		avatar
	},
	data() {
		return {
			canEdit: false,
			// imageStyles:{
			// 	width:148,
			// 	height:148,
			// 	border: {
			// 		radius: '50%'
			// 	}
			// },
			user: {}
			// name: '',
			// deptName: '',
			// photo: ''
		};
	},
	onShow: function() {
		let that = this;
		that.ajax(that.url.searchUserSummary, 'GET', null, function(resp) {
			let result = resp.data.result;
			that.user = result;
			// that.name = result.name;
			// that.deptName = result.deptName;
			// that.photo = result.photo;
		});
	},
	methods: {
		logout() {
			// 清理本地数据缓存
			uni.clearStorageSync();
			uni.reLaunch({
				url: '../login/login'
			});
		},
		//上传返回图片
		myUpload(rsp) {
			// path: 临时头像地址
			this.user.photo = rsp.path; //更新头像方式一
			// rsp.avatar.imgSrc = rsp.path; //更新头像方式二
			let that = this;
			uni.uploadFile({
				url: that.url.updateUserPhoto,
				filePath: that.user.photo,
				name: 'photo',
				header: {
					token: uni.getStorageSync('token')
				},
				// formData: {
				//     address: address,
				//     country: nation,
				//     province: province,
				//     city: city,
				//     district: district
				// },
				success: function(resp) {
					let data = JSON.parse(resp.data);
					// that.user.photo = data.msg
				}
			});
		},
		editAvatar() {
			this.canEdit = true;
		},
		toEmployPage() {
			uni.navigateTo({
				url: '../employee/employee?opt=mine&employee=' + encodeURIComponent(JSON.stringify(this.user))
			});
		},
		toEmployList() {
			uni.navigateTo({
				url: '../employee_list/employee_list?deptId=' + this.user.deptId + '&roleId=' + JSON.parse(this.user.role)[0]
			});
		}
	}
};
</script>

<style lang="less">
@import url('mine.less');
</style>
