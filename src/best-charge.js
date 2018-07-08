
const {loadAllItems} = require('./items');
const {loadPromotions} = require('./promotions');
function bestCharge(selectedItems) {
  let allItemArray = loadAllItems();
  let promotionArray = loadPromotions();
  let cartDishesArray = buildCartDishes(allItemArray);
  let cartDishesWithDetailArray = buildCartDishesWithDetailById(cartDishesArray,allItemArray);
  let originalPrice = calculateCartDishesOriginalPrice(cartDishesWithDetailArray);
  let promotionPriceMap = getCartDishesPromotionPriceMap(cartDishesArray,promotionArray);
  let promotionType = choosePromotionWay(promotionPriceMap);
  let promotionPrice = getPromotionPriceByPromotionType(promotionPriceMap,promotionType);
  let bestCharge = calCartDishesBestCharge(originalPrice,promotionPrice);
  let receipt = generateReceipt(cartDishesWithDetailArray,originalPrice,promotionType,originalPrice);
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

}
function getCartDishesPromotionPriceMap(cartDishesArray,promotionArray){

}
function calculateCartDishesPromotionPrice(){

}
function choosePromotionWay(promotionPriceMap){

}
function getPromotionPriceByPromotionType(promotionPriceMap,promotionType){

}
function calCartDishesBestCharge(originalPrice,promotionPrice){

}
function generateReceipt(cartDishesWithDetailArray,originalPrice,promotionType,originalPrice){

}
module.exports = {bestCharge,buildCartDishes,buildCartDishesWithDetailById,calculateCartDishesOriginalPrice,getCartDishesPromotionPriceMap,calculateCartDishesPromotionPrice,choosePromotionWay,getPromotionPriceByPromotionType,generateReceipt}
