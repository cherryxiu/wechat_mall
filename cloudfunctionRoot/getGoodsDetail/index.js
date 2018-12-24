// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {

  const detail = await db.collection("cl_goods_detail").where({
    "goods_id": event.id
  }).get();
  const basicInfo = await db.collection("cl_goods").where({
    "id": parseInt(event.id)
  }).get();
  return {
    detail, basicInfo
  };
}