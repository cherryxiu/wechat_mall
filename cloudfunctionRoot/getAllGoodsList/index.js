/**
 * 获取商品列表
 */


// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  //categoryId为空时查询全部商品
  if (event.categoryId == "") {
    return db.collection("cl_goods").get()
  } else {
    return db.collection("cl_goods").where({
      "category_id": _.eq(parseInt(event.categoryId))
    }).get()
  }
}