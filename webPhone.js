var webPhone = {
	uid: '0',
	channel: "95588",
	appid: '40774ea4e1f0461c823ebe460cceff63',
	//appid:'20150314000000110000000000000010',
	appToken: "a11001fab6cde84fbb0f9dcb6dd47b00",
	account_number:"",
	getTimeStamp: function() {
		var now = new Date();
		var timestamp = now.getFullYear() + '' + ((now.getMonth() + 1) >= 10 ? "" + (now.getMonth() + 1) : "0" + (now.getMonth() + 1)) + (now.getDate() >= 10 ? now.getDate() : "0" + now.getDate()) + (now.getHours() >= 10 ? now.getHours() : "0" + now.getHours()) + (now.getMinutes() >= 10 ? now.getMinutes() : "0" + now.getMinutes()) + (now.getSeconds() >= 10 ? now.getSeconds() : "0" + now.getSeconds());
		return timestamp;
	},
	getsig:function(timestamp){

		return hex_md5(webPhone.appid + webPhone.account_number + timestamp+ webPhone.appToken);
	},
	do_login:function(){
		webPhone.account_number=$("#account_number").val();
		if(webPhone.account_number==null||""==webPhone.account_number ){
			alert('please input a account_number');
			return false;
		}

		var timestamp=webPhone.getTimeStamp();


				//账号登录参数设置
		var loginBuilder = new RL_YTX.LoginBuilder();
		loginBuilder.setType('1');//登录类型 1账号登录，2voip账号密码登录
		loginBuilder.setUserName(webPhone.account_number);//设置用户名
		loginBuilder.setPwd('');//type值为1时，密码可以不赋值
		loginBuilder.setSig(webPhone.getsig(timestamp));//设置sig
		loginBuilder.setTimestamp(timestamp);//设置时间戳
		//执行用户登录
		RL_YTX.login(loginBuilder, function(obj){
		    //登录成功回调
		    console.log('login success');
			RL_YTX.onMsgReceiveListener(function(obj){
			//收到push消息或者离线消息或判断输入状态
			//如果obj.msgType==12  判断obj.msgDomainn的值
			//obj.msgDomain 0 无输入状态  1 正在输入  2 正在录音
			});
		    //注册群组通知事件监听
		    RL_YTX.onNoticeReceiveListener(function(obj){
			//收到群组通知
			});
			RL_YTX.onConnectStateChangeLisenter(function(obj){
		        //连接状态变更
			// obj.code;//变更状态 1 断开连接 2 重连中 3 重连成功 4 被踢下线 5 断开连接，需重新登录
			// 断线需要人工重连
				});
			}, function(obj){
		    //登录失败方法回调
		    console.log('login error');
		});

	},
	initYTXSDK:function(){
		//初始化SDK
		var resp = RL_YTX.init("8aaf07085a6ec238015a749c57470485");
		if(170002== resp.code){
		//缺少必要参数，详情见msg参数
		//用户逻辑处理
		}else if(174001 == resp.code){
		//不支持HTML5，关闭页面
		//用户逻辑处理
		}else if(200 == resp.code){
		//初始化成功
		//用户逻辑处理
	    //判断不支持的功能，屏蔽页面展示
	    //var unsupport = obj.unsupport;
	    //login();
	    	console.log('init sdk success')
		}
	}

}
