var webCall={
  callid:"",//唯一消息标识
  caller:"",//主叫号码
  called:"",//被叫
  calltype:"",//0 音频 1 视频
  stat:"",
          //1 对方振铃（被叫的振铃消息） 2 呼叫中（主叫呼叫发送成功返回该值） 3 呼叫建立（被叫接收后主叫监听到该值）
        //4 呼叫失败（对主叫；对方拒绝或者忙） 5 结束通话（主叫取消成功和主、被叫挂机成功后得到该值）
        //6 呼叫到达（被叫监听到呼叫请求时获得该值）
        //7 媒体已正式建立连接（被叫获取该值）
  code:""// 200操作成功，非200代表因本地原因，导致无法接受音视频邀请(例如不支持音视频等)，具体原因请参照错误码
}
