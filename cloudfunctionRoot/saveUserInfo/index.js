// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  return await db.collection('cl_user_base_info').add({
    data: {
      'nick_name': event.nickName,
      'gender': event.gender,
      'language': event.language,
      'city': event.city,
      'province': event.province,
      'country': event.country,
      'avatar_url': event.avatarUrl
    }
  })
}