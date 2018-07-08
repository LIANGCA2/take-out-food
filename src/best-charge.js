
const {loadAllItems} = require('./items');
const {loadPromotions} = require('./promotions');
function bestCharge(selectedItems) {
  let allItemArray = loadAllItems();
  let promotionArray = loadPromotions();
  let cartDishesArray = buildCartDishes(selectedItems);
  let cartDishesWithDetailArray = buildCartDishesWithDetailById(cartDishesArray,allItemArray);
  let originalPrice = calculateCartDishesOriginalPrice(cartDishesWithDetailArray);
  let promotionPriceMap = getCartDishesPromotionPriceMap(cartDishesWithDetailArray,promotionArray);
  let promotionType = choosePromotionType(promotionPriceMap);
  let promotionPrice = getPromotionPriceByPromotionType(promotionPriceMap,promotionType);
  let bestCharge = calCartDishesBestCharge(originalPrice,promotionPrice);
  let receipt = generateReceipt(cartDishesWithDetailArray,promotionType,promotionPrice,bestCharge);
  return receipt;
}
function buildCartDishes(allItemArray){
//["ITEM0001 x 1", "ITEM0013 x 2", "ITEM0022 x 1"]
  let cartDishesArray =[] ;
  allItemArray.forEach((item) =>{
    const [id,count] = item.split("x");
    cartDishesArray.push({
      id:id.trim(),
      count:count.trim()
    })
  });
  return cartDishesArray;
}
function buildCartDishesWithDetailById(cartDishesArray,allItemArray){
 let cartDishesWithDetailArray = [];
 cartDishesArray.forEach((cartDish)=>{
   const {id,name,price} = allItemArray.find((item)=>item.id ===cartDish.id);
   cartDishesWithDetailArray.push({
     id,
     name,
     price,
     count:cartDish.count
   })
 })
  return cartDishesWithDetailArray;
}
function calculateCartDishesOriginalPrice(cartDishesWithDetailArray){
  let originPrice = 0;
cartDishesWithDetailArray.forEach((cartDish)=>{
  originPrice+=parseFloat(cartDish.price) * parseInt(cartDish.count);
})
  return originPrice;
}
function getCartDishesPromotionPriceMap(cartDishesWithDetailArray,promotionArray){
return promotionArray.map((promotion) =>{
  return {
    promotionType:promotion.type,
    promotionPrice:calculateCartDishesPromotionPrice(cartDishesWithDetailArray,promotion)
  }
})
}
function calculateCartDishesPromotionPrice(cartDishesWithDetailArray,promotion){
  let promotionPrice = 0;

  switch (promotion.type){
    case "满30减6元":
      promotionPrice = calCartDishesBy30Minus6(cartDishesWithDetailArray);break;
    case "指定菜品半价":
      promotionPrice = calCartDishesBySpecifyHalfPrice(cartDishesWithDetailArray,promotion);break;
  }
  return promotionPrice;
}
function calCartDishesBy30Minus6(cartDishesWithDetailArray){
  let sum = 0,promotionPrice = 0;
  cartDishesWithDetailArray.forEach((cartDishWithDetail)=>{
    sum+=parseInt(cartDishWithDetail.count)*parseFloat(cartDishWithDetail.price);
    if(sum >= 30) {
      promotionPrice =  6;
    }
  });
  return promotionPrice;
}
function calCartDishesBySpecifyHalfPrice(cartDishesWithDetailArray,promotion){
  let promotionPrice = 0;
  cartDishesWithDetailArray.forEach((cartDish)=>{
    if(promotion.items.includes(cartDish.id)){
      promotionPrice+=parseFloat(cartDish.price)*parseInt(cartDish.count)*0.5;
    }
  })
  return promotionPrice;
}
function choosePromotionType(promotionPriceMap){
  let promotionType = "满30减6元",promotionPrice = 0;
  promotionPriceMap.forEach((promotion)=>{
    if(promotion.promotionPrice>promotionPrice){
      promotionType = promotion.promotionType;
      promotionPrice = promotion.promotionPrice;
    }
  })
  if(promotionPrice === 0)
  {
    return null;
  }else{
    return promotionType;
  }
}
function getPromotionPriceByPromotionType(promotionPriceMap,promotionType){
  if(promotionType!=null){
return promotionPriceMap.find((promotion)=>promotion.promotionType===promotionType).promotionPrice;
  }else{
    return 0;
  }
}
function calCartDishesBestCharge(originalPrice,promotionPrice){
return originalPrice-promotionPrice;
}
function generateReceipt(cartDishesWithDetailArray,promotionType,promotionPrice,bestCharge){

  let receipt = `
============= 订餐明细 =============`

  cartDishesWithDetailArray.forEach((cartDish)=>{
    receipt+=`\n${cartDish.name} x ${cartDish.count} = ${parseInt(cartDish.count)*parseFloat(cartDish.price)}元`;
  }
)

  receipt+=`\n-----------------------------------`;
  if(promotionType!=null){
    receipt+=`\n使用优惠:
${promotionType}`
      if(promotionType ==='指定菜品半价'){
        receipt+=`(黄焖鸡，凉皮)`;
      }
    receipt+=`，省${promotionPrice}元
-----------------------------------`
  }

  receipt+=`\n总计：${bestCharge}元
===================================`
  return receipt;
}

module.exports = {bestCharge,buildCartDishes,buildCartDishesWithDetailById,calculateCartDishesOriginalPrice,getCartDishesPromotionPriceMap,calculateCartDishesPromotionPrice,calCartDishesBestCharge,choosePromotionType,getPromotionPriceByPromotionType,generateReceipt,calCartDishesBy30Minus6,calCartDishesBySpecifyHalfPrice}
