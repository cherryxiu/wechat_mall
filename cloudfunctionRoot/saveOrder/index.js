// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  return await db.collection('cl_order').add({
    data: {
      'nick_name': event.nickName,
      'goods_json_str': event.goodsJsonStr,
      'remark': event.remark,
      'all_goods_price': event.allGoodsPrice,
      'create_time': event.createTime
    }
  })
}