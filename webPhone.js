var webPhone = {
	uid: '0',
	channel: "95588",
	appid: '8aaf07085a6ec238015a749c57470485',
	//appid:'20150314000000110000000000000010',
	appToken: "a11001fab6cde84fbb0f9dcb6dd47b00",
	account_number: "",
	localview: null,
	remoteview: null,
	do_logout: function() {
		RL_YTX.logout(function() {
			webPhone.showMessage("logout");
		}, function onError(obj) {
			webPhone.showMessage(obj.code); //错误码
			webPhone.showMessage(obj.msg); //错误描述
		});
	},
	startCall: function() {
		var calltype = $("#calltype").val();
		var makeCallBuilder = new RL_YTX.MakeCallBuilder();
		makeCallBuilder.setCalled($("#dialnumber").val());
		makeCallBuilder.setCallType(calltype); //呼叫的类型 0 音频 1视频
		if (calltype == 1) {
			RL_YTX.setCallView(webPhone.remoteview, webPhone.localview); //呼叫类型1的时候这么传
		} else {
			RL_YTX.setCallView(webPhone.remoteview, null); //呼叫类型是0的时候这么传
		}
		RL_YTX.makeCall(makeCallBuilder,
			function() {
				//呼叫成功
				webPhone.showMessage("call success to:" + $("#dialnumber").val());
			},
			function callback(obj) {
				webPhone.showMessage("call failed to:" + $("#dialnumber").val());
				webPhone.showMessage(obj.code); //错误码
			});
	},
	answerCall: function() {
		var voipAcceptBuilder = new RL_YTX.AcceptCallBuilder();
		voipAcceptBuilder.setCallId(webCall.callid); //请求的callId，
		voipAcceptBuilder.setCaller(webCall.caller); //请求的主叫号码，即Tony的号码
		//通过RL_YTX.onCallMsgListener(callback)中的callback.callId属性获得callId
		//通过RL_YTX.onCallMsgListener(callback)中的callback.caller属性获得caller
		RL_YTX.accetpCall(voipAcceptBuilder,
			function() {
				webPhone.showMessage("answerCall");
			},
			function callback(obj) {
				alert(obj.code) //错误码
			})
	},
	rejectCall: function() {
		var VoipRejectBuilder = new RL_YTX.RejectCallBuilder();
		VoipRejectBuilder.setCallId(webCall.callid); //请求的callId
		VoipRejectBuilder.setCaller(webCall.caller); //请求的主叫号码，即Tony的号码

		//通过RL_YTX.onCallMsgListener(callback)中的callback.callId属性获得callId
		//通过RL_YTX.onCallMsgListener(callback)中的callback.caller属性获得caller
		//通过RL_YTX.onCallMsgListener(callback)中的callback.reason属性获得reason
		RL_YTX.rejectCall(VoipRejectBuilder, function() {
			webPhone.showMessage("rejectCall");
		}, function(obj) {
			alert(obj.code)
		})

	},
	cancelCall: function() {
		var VoipReleaseBuilder = new RL_YTX.ReleaseCallBuilder();
		VoipReleaseBuilder.setCallId(webCall.callid); //请求的callId
		VoipReleaseBuilder.setCaller(webCall.caller); //请求的主叫号码，即Tony的号码
		VoipReleaseBuilder.setCalled(webCall.called); // 请求的被叫号码，即John的号码
		//通过RL_YTX.onCallMsgListener(callback)中的callback.callId属性获得callId
		//通过RL_YTX.onCallMsgListener(callback)中的callback.caller属性获得called
		//通过RL_YTX.onCallMsgListener(callback)中的callback.called属性获得caller
		RL_YTX.releaseCall(VoipReleaseBuilder, function() {
			webPhone.showMessage("cancleCall")
		}, function(obj) {
			alert(obj.code)
		})

	},
	getTimeStamp: function() {
		var now = new Date();
		var timestamp = now.getFullYear() + '' + ((now.getMonth() + 1) >= 10 ? "" + (now.getMonth() + 1) : "0" + (now.getMonth() + 1)) + (now.getDate() >= 10 ? now.getDate() : "0" + now.getDate()) + (now.getHours() >= 10 ? now.getHours() : "0" + now.getHours()) + (now.getMinutes() >= 10 ? now.getMinutes() : "0" + now.getMinutes()) + (now.getSeconds() >= 10 ? now.getSeconds() : "0" + now.getSeconds());
		return timestamp;
	},
	getsig: function(timestamp) {

		return hex_md5(webPhone.appid + webPhone.account_number + timestamp + webPhone.appToken);
	},
	do_login: function() {
		webPhone.account_number = $("#account_number").val();
		if (webPhone.account_number == null || "" == webPhone.account_number) {
			alert('please input a account_number');
			return false;
		}

		var timestamp = webPhone.getTimeStamp();


		//账号登录参数设置
		var loginBuilder = new RL_YTX.LoginBuilder();
		loginBuilder.setType('1'); //登录类型 1账号登录，2voip账号密码登录
		loginBuilder.setUserName(webPhone.account_number); //设置用户名
		loginBuilder.setPwd(''); //type值为1时，密码可以不赋值
		loginBuilder.setSig(webPhone.getsig(timestamp)); //设置sig
		loginBuilder.setTimestamp(timestamp); //设置时间戳
		//执行用户登录
		RL_YTX.login(loginBuilder, function(obj) {
			//登录成功回调
			webPhone.showMessage('login success');
			RL_YTX.onMsgReceiveListener(function(obj) {
				//收到push消息或者离线消息或判断输入状态
				//如果obj.msgType==12  判断obj.msgDomainn的值
				//obj.msgDomain 0 无输入状态  1 正在输入  2 正在录音
			});
			//注册群组通知事件监听
			RL_YTX.onNoticeReceiveListener(function(obj) {
				//收到群组通知
			});
			RL_YTX.onConnectStateChangeLisenter(function(obj) {
				//连接状态变更
				// obj.code;//变更状态 1 断开连接 2 重连中 3 重连成功 4 被踢下线 5 断开连接，需重新登录
				// 断线需要人工重连
			});
			RL_YTX.onCallMsgListener(function(obj) {
				webPhone.showMessage("=========there is a call incoming============")
				webPhone.showMessage(obj.callId); //唯一消息标识
				webCall.callid = obj.callId;
				webPhone.showMessage(obj.caller); //主叫号码
				webCall.caller = obj.caller;
				webPhone.showMessage(obj.called); //被叫无值
				webCall.called = obj.called;
				webPhone.showMessage(obj.callType); //0 音频 1 视频
				webCall.calltype = obj.callType;
				webPhone.showMessage(obj.state);
				webCall.stat = obj.satte;
				//1 对方振铃（被叫的振铃消息） 2 呼叫中（主叫呼叫发送成功返回该值） 3 呼叫建立（被叫接收后主叫监听到该值）
				//4 呼叫失败（对主叫；对方拒绝或者忙） 5 结束通话（主叫取消成功和主、被叫挂机成功后得到该值）
				//6 呼叫到达（被叫监听到呼叫请求时获得该值）
				//7 媒体已正式建立连接（被叫获取该值）
				webPhone.showMessage(obj.code); // 200操作成功，非200代表因本地原因，导致无法接受音视频邀请(例如不支持音视频等)，具体原因请参照错误码
				webCall.code = obj.code;

				//setCallView
				if (obj.callType == '1') {
					RL_YTX.setCallView(webPhone.remoteview, webPhone.localview); //呼叫类型1的时候这么传
				} else {
					RL_YTX.setCallView(webPhone.remoteview, null); //呼叫类型1的时候这么传
				}

			});
		}, function(obj) {
			//登录失败方法回调
			webPhone.showMessage('login error');
		});

	},
	initYTXSDK: function() {
		//初始化SDK
		var resp = RL_YTX.init("8aaf07085a6ec238015a749c57470485");
		if (170002 == resp.code) {
			//缺少必要参数，详情见msg参数
			//用户逻辑处理
		} else if (174001 == resp.code) {
			//不支持HTML5，关闭页面
			//用户逻辑处理
		} else if (200 == resp.code) {
			//初始化成功
			//用户逻辑处理
			//判断不支持的功能，屏蔽页面展示
			//var unsupport = obj.unsupport;
			//login();
			webPhone.showMessage('init sdk success');
			webPhone.remoteview = $("#remotview")[0];
			webPhone.localview = $("#localview")[0];
		}
	},
	showMessage: function(msg) {
		$("#messageArea").val($("#messageArea").val() + msg + "\n");
	}

}
