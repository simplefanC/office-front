// let baseUrl = "http://192.168.43.74:8080"
// let baseUrl = "http://localhost:8080"
let baseUrl = "http://192.168.239.128:8080"
let url = {
	register: baseUrl + "/user/register",
	login: baseUrl + "/user/login",
	loginByPass: baseUrl + "/user/loginByPass",
	updateUserPhoto: baseUrl + "/user/updateUserPhoto",
	searchAllUser: baseUrl + "/user/searchAllUser",
	resetPass: baseUrl + "/user/resetPass",
	updateUserInfo: baseUrl + "/user/updateUserInfo",
	deleteUserById: baseUrl + "/user/deleteUserById",
	searchUserGroupByDept: baseUrl + "/user/searchUserGroupByDept",
	searchMembers: baseUrl + "/user/searchMembers",
	searchUserSummary: baseUrl + "/user/searchUserSummary",
	selectUserPhotoAndName: baseUrl + "/user/selectUserPhotoAndName",
	genUserSig: baseUrl + "/user/genUserSig",
	checkValidRole: baseUrl + "/user/checkValidRole",
	
	checkin: baseUrl + "/checkin/checkin",
	createFaceModel: baseUrl + "/checkin/createFaceModel",
	validCanCheckIn: baseUrl + "/checkin/validCanCheckIn",
	searchTodayCheckin: baseUrl + "/checkin/searchTodayCheckin",
	searchMonthCheckin: baseUrl + "/checkin/searchMonthCheckin",

	refreshMessage: baseUrl + "/message/refreshMessage",
	searchMessageByPage: baseUrl + "/message/searchMessageByPage",
	searchMessageById: baseUrl + "/message/searchMessageById",
	updateUnreadMessage: baseUrl + "/message/updateUnreadMessage",
	deleteMessageRefById: baseUrl + "/message/deleteMessageRefById",
	
	searchMyMeetingListByPage: baseUrl + "/meeting/searchMyMeetingListByPage",
	insertMeeting: baseUrl + "/meeting/insertMeeting",
	searchMeetingById: baseUrl + "/meeting/searchMeetingById",
	updateMeetingInfo: baseUrl + "/meeting/updateMeetingInfo",
	deleteMeetingById: baseUrl + "/meeting/deleteMeetingById",
	searchRoomIdByUUID: baseUrl + "/meeting/searchRoomIdByUUID",
	searchUserMeetingInMonth: baseUrl + "/meeting/searchUserMeetingInMonth",

	searchUserTaskListByPage: baseUrl + "/workflow/searchUserTaskListByPage",
	approvalMeeting: baseUrl + "/workflow/approvalMeeting",
	
	searchRoleOwnPermission: baseUrl + "/role/searchRoleOwnPermission",
	searchAllPermission: baseUrl + "/role/searchAllPermission",
	insertRole: baseUrl + "/role/insertRole",
	updateRolePermissions: baseUrl + "/role/updateRolePermissions",
	searchAllRole: baseUrl + "/role/searchAllRole",
	deleteRoleById: baseUrl + "/role/deleteRoleById",
	
	searchAllDept: baseUrl + "/dept/searchAllDept",
	insertDept: baseUrl + "/dept/insertDept",
	updateDept: baseUrl + "/dept/updateDept",
	deleteDeptById: baseUrl + "/dept/deleteDeptById",
	
	getNewsByPage: baseUrl + "/news/getNewsByPage",
	getNewsContent: baseUrl + "/news/getNewsContent",
	
	getSystemConfig: baseUrl + "/sys/getSystemConfig",
	saveSystemConfig: baseUrl + "/sys/saveSystemConfig",
	addOrDeleteHoliday: baseUrl + "/sys/addOrDeleteHoliday",
	addOrDeleteWorkday: baseUrl + "/sys/addOrDeleteWorkday",
	searchScheduleInMonth: baseUrl + "/sys/searchScheduleInMonth"
}

export default url

