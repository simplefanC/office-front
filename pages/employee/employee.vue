<template>
	<view class="page">
		<view class="attr">
			<view class="list">
				<view class="item" @tap="editName">
					<view class="key">姓名</view>
					<text class="value">{{ employee.name == '' ? '请输入' : employee.name }}</text>
				</view>
				<view class="item" v-if="opt != 'add'">
					<view class="key">工号</view>
					<text class="value">{{ employee.id }}</text>
				</view>
				<view class="item" @tap="editIdNum">
					<view class="key">身份证号</view>
					<text class="value">{{ employee.idNum == '' ? '请输入' : employee.idNum }}</text>
				</view>
				<view class="item">
					<view class="key">性别</view>
					<picker :range="sexArray" :value="sexIndex" @change="sexChange">{{ sexIndex === -1 ? '请选择' : sexArray[sexIndex] }}</picker>
				</view>
				<view class="item">
					<view class="key">所在部门</view>
					<picker v-if="opt != 'mine'" :value="deptIndex" :range="deptArray" range-key="deptName" @change="deptChange">
						{{ deptIndex === -1 ? '请选择' : deptArray[deptIndex].deptName }}
					</picker>
					<text class="value" v-if="opt == 'mine'">{{ employee.deptName }}</text>
				</view>
				<view class="item" @tap="editTel">
					<view class="key">联系电话</view>
					<text class="value">{{ employee.tel == '' ? '请输入' : employee.tel }}</text>
				</view>
				<view class="item" @tap="editEmail">
					<view class="key">邮箱</view>
					<text class="value">{{ employee.email == '' ? '请输入' : employee.email }}</text>
				</view>
				<view class="item">
					<view class="key">入职日期</view>
					<picker v-if="opt == 'add'" mode="date" :value="employee.hiredate" @change="dateChange">
						<view class="uni-input">{{ employee.hiredate == '' ? '请选择' : employee.hiredate }}</view>
					</picker>
					<text class="value" v-if="opt != 'add'">{{ employee.hiredate }}</text>
				</view>
				<view class="item">
					<view class="key">隶属角色</view>
					<picker v-if="opt != 'mine'" :value="roleIndex" :range="roleArray" range-key="roleName" @change="roleChange">
						{{ roleIndex === -1 ? '请选择' : roleArray[roleIndex].roleName }}
					</picker>
					<text class="value" v-if="opt == 'mine'">{{ employee.roleName }}</text>
					<!-- <text class="value" v-if="opt != 'mine'" @tap="show = true">{{ info || '请选择' }}</text>
					<text class="value" v-if="opt == 'mine'">{{ info }}</text> -->
				</view>
				<!-- <multiple-select 
				v-model="show" 
				:data="list" 
				:default-selected="defaultSelectedId" 
				@confirm="confirm">
				</multiple-select> -->

				<!-- <view class="item">
					<view class="key">当前状态</view>
					<picker v-if="opt != 'mine'" :range="statusArray" :value="statusIndex" @change="statusChange">
						{{ statusIndex === -1 ? '请选择' : statusArray[statusIndex] }}
					</picker>
					<text class="value" v-if="opt == 'mine'">{{ statusArray[statusIndex] }}</text>
				</view> -->
				<view class="item" @tap="updatePass()" v-if="opt == 'mine'"><view class="key">修改密码</view></view>
			</view>
		</view>

		<button class="btn" @tap="save()" v-if="opt == 'mine' || !isRoot">保存</button>
		<button v-if="opt == 'list' && !isRoot" class="btn" @tap="deleteEmployee()" style="background-color: #ed5e68;">删除</button>

		<uni-popup ref="popupName" type="dialog">
			<uni-popup-dialog mode="input" title="编辑文字内容" :value="employee.name" placeholder="请输入姓名" @confirm="finishName" />
		</uni-popup>
		<uni-popup ref="popupIdNum" type="dialog">
			<uni-popup-dialog mode="input" title="编辑文字内容" :value="employee.idNum" placeholder="请输入身份证号" @confirm="finishIdNum" />
		</uni-popup>
		<uni-popup ref="popupEmail" type="dialog">
			<uni-popup-dialog mode="input" title="编辑文字内容" :value="employee.email" placeholder="请输入邮箱" @confirm="finishEmail" />
		</uni-popup>
		<uni-popup ref="popupTel" type="dialog">
			<uni-popup-dialog mode="input" title="编辑文字内容" :value="employee.tel" placeholder="请输入联系电话" @confirm="finishTel" />
		</uni-popup>
	</view>
</template>

<script>
import uniPopup from '@/components/uni-popup/uni-popup.vue';
import uniPopupMessage from '@/components/uni-popup/uni-popup-message.vue';
import uniPopupDialog from '@/components/uni-popup/uni-popup-dialog.vue';
import multipleSelect from '@/components/multiple-select/multiple-select';
import { isCardID, checkStr } from '@/common/tool.js';
export default {
	components: {
		uniPopup,
		uniPopupMessage,
		uniPopupDialog,
		multipleSelect
	},
	data() {
		return {
			statusIndex: 1,
			statusArray: ['离职', '在职'],
			sexIndex: -1,
			sexArray: ['男', '女'],
			roleIndex: -1,
			roleArray: [],
			deptIndex: -1,
			deptArray: [],
			canEdit: false,
			employee: {
				id: 0,
				name: '',
				deptName: '',
				role: '',
				sex: '',
				name: '',
				deptId: -1,
				photo: 'https://aliyun_id_photo_bucket.oss.aliyuncs.com/default_handsome.jpg',
				tel: '',
				idNum: '',
				hiredate: '',
				email: '',
				status: 1
			},
			// show: false, //是否显示 - 双向绑定
			// info: '',
			// list: [], //数据源
			opt: '',
			isRoot: false
		};
	},
	onLoad: function(options) {
		this.opt = options.opt;
		if (this.opt != 'add') {
			this.employee = JSON.parse(decodeURIComponent(options.employee));
		} else {
			//只能add该部门
			this.add_deptId = options.deptId;
			this.add_roleId = options.roleId;
		}
	},
	onShow: function() {
		let that = this;
		if(that.opt == 'list' && that.employee.roleName == '超级管理员'){
			uni.showToast({
				icon: 'none',
				title: '超级管理员无法被修改'
			});
		}
		if(that.employee.role){
			that.roleId = JSON.parse(that.employee.role)[0]
		}
		if (that.opt != 'mine') {
			that.ajax(that.url.searchAllRole, 'POST', {}, function(resp) {
				that.roleArray = resp.data.result;
				if (that.roleId) {
					for (let i = 0; i < that.roleArray.length; i++) {
						if (that.roleArray[i].id == that.roleId) {
							that.roleIndex = i;
							break;
						}
					}
				}
			});
			that.ajax(that.url.searchAllDept, 'POST', {}, function(resp) {
				that.deptArray = resp.data.result;
				for (let i = 0; i < that.deptArray.length; i++) {
					if (that.deptArray[i].id == that.employee.deptId) {
						that.deptIndex = i;
						break;
					}
				}
			});
		}
		if (that.employee.sex == '男') that.sexIndex = 0;
		else if (that.employee.sex == '女') that.sexIndex = 1;

		that.statusIndex = that.employee.status;
	},
	methods: {
		roleChange(e) {
			this.roleIndex = e.detail.value;
		},
		deptChange: function(e) {
			this.deptIndex = e.detail.value;
		},
		sexChange: function(e) {
			this.sexIndex = e.detail.value;
		},
		statusChange: function(e) {
			this.statusIndex = e.detail.value;
		},
		dateChange: function(e) {
			this.employee.hiredate = e.detail.value;
		},
		updatePass() {
			uni.navigateTo({
				url: '../login/forget'
			});
		},
		// 确定事件
		// confirm(data) {
		// 	if(data.length > 1){
		// 		uni.showToast({
		// 			icon: 'none',
		// 			title: '只能隶属一个角色'
		// 		});
		// 		return
		// 	}
		// 	this.info = data.map(el => el.label).join(',');
		// 	this.show = false;
		// 	this.defaultSelectedId = []
		// 	data.forEach(el => {
		// 		this.defaultSelectedId.push(el.value)
		// 	})
		// },
		editName() {
			if (this.opt != 'mine') this.$refs.popupName.open();
		},
		editEmail() {
			this.$refs.popupEmail.open();
		},
		editTel() {
			this.$refs.popupTel.open();
		},
		editIdNum() {
			if (this.opt != 'mine') this.$refs.popupIdNum.open();
		},
		finishIdNum(done, value) {
			let res = isCardID(value);
			if (res.passed) {
				this.employee.idNum = value;
				done();
			} else {
				uni.showToast({
					icon: 'none',
					title: res.msg
				});
			}
		},
		finishTel(done, value) {
			if (!this.checkValidTel(value, '联系电话')) {
				this.employee.tel = value;
				done();
			}
		},
		finishName(done, value) {
			// if(!this.checkValidTel(value, "联系电话")){
			this.employee.name = value;
			done();
			// }
		},
		finishEmail(done, value) {
			if (!this.checkValidEmail(value, '邮箱')) {
				this.employee.email = value;
				done();
			}
		},
		deleteEmployee: function() {
			if (!this.checkPermission(['ROOT', 'EMPLOYEE:DELETE'])) {
				uni.showToast({
					icon: 'none',
					title: '您不具备删除权限'
				});
				return;
			}
			let that = this;
			uni.showModal({
				title: '提示信息',
				content: '是否删除这个员工？',
				success: function(resp) {
					if (resp.confirm) {
						//成功删除后跳转到list页
						that.ajax(that.url.deleteUserById, 'POST', { id: that.employee.id }, function(resp) {
							let result = resp.data.result;
							uni.showToast({
								icon: 'none',
								title: '删除成功',
								complete: function() {
									setTimeout(function() {
										uni.navigateBack({});
									}, 2000);
								}
							});
						});
					}
				}
			});
		},
		save: function() {
			let that = this;
			//验证数据
			if (!checkStr(that.employee.name, 'name')) {
				uni.showToast({
					icon: 'none',
					title: '姓名格式错误'
				});
				return;
			}
			let res = isCardID(that.employee.idNum);
			console.log(res);
			if (!res.passed) {
				uni.showToast({
					icon: 'none',
					title: res.msg
				});
				return;
			}
			if (that.sexIndex == -1) {
				uni.showToast({
					icon: 'none',
					title: '请选择性别'
				});
				return;
			}
			if (that.employee.deptId == -1 && that.deptIndex == -1) {
				uni.showToast({
					icon: 'none',
					title: '请选择所在部门'
				});
				return;
			}
			if (that.deptIndex != -1) {
				that.employee.deptId = that.deptArray[that.deptIndex].id;
			}
			if (that.add_deptId) {
				if (that.add_roleId >= 2 && that.add_deptId != that.employee.deptId) {
					uni.showToast({
						icon: 'none',
						title: '您只能添加本部门员工'
					});
					return;
				}
			}
			if (that.checkValidTel(that.employee.tel, '联系电话') || that.checkValidEmail(that.employee.email, '邮箱')) {
				return;
			}
			if (!that.employee.hiredate) {
				uni.showToast({
					icon: 'none',
					title: '请选择入职日期'
				});
				return;
			}
			//add
			if (that.employee.role == '' && that.roleIndex == -1) {
				uni.showToast({
					icon: 'none',
					title: '请选择一个角色'
				});
				return;
			}
			//add update
			if (that.opt != 'mine' && that.roleArray[that.roleIndex].id == 0) {
				uni.showToast({
					icon: 'none',
					title: '无法添加超级管理员'
				});
				return;
			}
			if(that.roleIndex != -1){
				that.roleId = that.roleArray[that.roleIndex].id
			}
			that.ajax(that.url.checkValidRole, 'GET', { id: that.employee.id, deptId: that.employee.deptId, roleId: that.roleId }, function(resp) {
				that.employee.role = '[' + that.roleId + ']';
				that.employee.status = that.statusIndex;
				that.employee.sex = that.sexArray[that.sexIndex];
				that.ajax(that.url.updateUserInfo, 'POST', that.employee, function(resp) {
					uni.showToast({
						icon: 'success',
						title: '保存成功',
						complete: function() {
							setTimeout(function() {
								uni.navigateBack({});
							}, 2000);
						}
					});
				});
			});
		}
		// deleteMember: function(id) {
		// 	let that = this;
		// 	// 产生短暂震动
		// 	uni.vibrateShort({});
		// 	uni.showModal({
		// 		title: '提示信息',
		// 		content: '删除该名参会人员？',
		// 		success: function(resp) {
		// 			if (resp.confirm) {
		// 				let position;
		// 				for (let i = 0; i < that.members.length; i++) {
		// 					let one = that.members[i];
		// 					if (one.id == id) {
		// 						position = i;
		// 						break;
		// 					}
		// 				}
		// 				that.members.splice(position, 1);
		// 			}
		// 		}
		// 	});
		// }
	}
};
</script>

<style lang="less">
@import url('employee.less');
</style>
