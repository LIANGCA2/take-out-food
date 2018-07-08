const {bestCharge} = require('../src/best-charge');
const {loadAllItems} = require('../src/items');
const {loadPromotions} = require('../src/promotions');
const{buildCartDishes,buildCartDishesWithDetailById,calculateCartDishesOriginalPrice,getCartDishesPromotionPriceMap,calculateCartDishesPromotionPrice,choosePromotionWay,getPromotionPriceByPromotionType,calCartDishesBestCharge,generateReceipt} = require('../src/best-charge');
describe('Take out food', function () {

  it('should generate best charge when best is 指定菜品半价', function() {
    let inputs = ["ITEM0001 x 1", "ITEM0013 x 2", "ITEM0022 x 1"];
    let summary = bestCharge(inputs).trim();
    let expected = `
============= 订餐明细 =============
黄焖鸡 x 1 = 18元
肉夹馍 x 2 = 12元
凉皮 x 1 = 8元
-----------------------------------
使用优惠:
指定菜品半价(黄焖鸡，凉皮)，省13元
-----------------------------------
总计：25元
===================================`.trim();
    expect(summary).toEqual(expected);
  });

  it('should generate best charge when best is 满30减6元', function() {
    let inputs = ["ITEM0013 x 4", "ITEM0022 x 1"];
    let summary = bestCharge(inputs).trim();
    let expected = `
============= 订餐明细 =============
肉夹馍 x 4 = 24元
凉皮 x 1 = 8元
-----------------------------------
使用优惠:
满30减6元，省6元
-----------------------------------
总计：26元
===================================`.trim();
    expect(summary).toEqual(expected);
  });

  it('should generate best charge when no promotion can be used', function() {
    let inputs = ["ITEM0013 x 4"];
    let summary = bestCharge(inputs).trim();
    let expected = `
============= 订餐明细 =============
肉夹馍 x 4 = 24元
-----------------------------------
总计：24元
===================================`.trim();
    expect(summary).toEqual(expected);
  });


  it('should return cartDishes specification Array', function() {
    let inputs = ["ITEM0001 x 2","ITEM0013 x 1"];
    let outputs = buildCartDishes(inputs);
    let expected = [{
      "id":"ITEM0001",
      "count":"2"
    },
      {
        "id":"ITEM0013",
        "count":"1"
      }];
    expect(JSON.stringify(outputs)).toEqual(JSON.stringify(expected));
  });

  it('should return cartDishes Detail Array', function() {
    let inputs = [{
      "id":"ITEM0001",
      "count":1
    },
      {
        "id":"ITEM0030",
        "count":2
      }];
    let allItemsArray = loadAllItems();
    let outputs = buildCartDishesWithDetailById(inputs,allItemsArray);
    let expected = [{
      "id":"ITEM0001",
      "name":"黄焖鸡",
      "price":18.00,
      "count":1
    },
      {
        "id":"ITEM0030",
        "name":"冰锋",
        "price":2.00,
        "count":2
      }];
    expect(JSON.stringify(outputs)).toEqual(JSON.stringify(expected));
  });

  it('should return originalPrice of cartDishes', function() {
    let inputs = [{
      "id":"ITEM0001",
        "name":"黄焖鸡",
      "price":18.00,
        "count":2
    },
      {
        "id":"ITEM0030",
        "name":"冰锋",
        "price":2.00,
        "count":5
      }];
    let outputs = calculateCartDishesOriginalPrice(inputs);
    let expected = 46;
    expect(outputs).toEqual(expected);
  });


  it('should return cartDishes PromotionPriceMap', function() {
    let inputs = [{
      "id":"ITEM0001",
      "name":"黄焖鸡",
      "price":18.00,
      "count":2
    },
      {
        "id":"ITEM0030",
        "name":"冰锋",
        "price":2.00,
        "count":5
      }];
    let promotionsArray = loadPromotions();
    let outputs = getCartDishesPromotionPriceMap(inputs,promotionsArray);
    let expected = [{
      "promotionType":"满30减6元",
      "promotionPrice":6
    },{
      "promotionType":"指定菜品半价",
      "promotionPrice":18
    }];
    expect(JSON.stringify(outputs)).toEqual(expected);
  });

  it('should return cartDishes promotionPrice By calculateCartDishes', function() {
    let cartDishesDetail = [{
      "id":"ITEM0001",
      "name":"黄焖鸡",
      "price":18.00,
      "count":2
    },
      {
        "id":"ITEM0030",
        "name":"冰锋",
        "price":2.00,
        "count":5
      }];
    let promotionsArray = loadPromotions();
    let type = "满30减6元";
    let outputs = calculateCartDishesPromotionPrice(cartDishesDetail,promotionsArray,type);
    let expected = 6;
    expect(outputs).toEqual(expected);
  });


  it('should return best PromotionWay', function() {
    let promtionMap = [{
      "promotionType":"满30减6元",
        "promotionPrice":6
    },{
      "promotionType":"指定菜品半价",
      "promotionPrice":18
    }];
    let outputs = choosePromotionWay(promtionMap);
    let expected = `指定菜品半价`;
    expect(JSON.stringify(outputs)).toEqual(expected);
  });



  it('should return promotionPrice by Type', function() {
    let promotionMap = [{
      "promotionType":"满30减6元",
        "promotionPrice":6
    },{
      "promotionType":"指定菜品半价",
      "promotionPrice":18
    }];
    let type = "指定菜品半价"
    let outputs =getPromotionPriceByPromotionType(promotionMap,type);
    let expected = 18;
    expect(outputs).toEqual(expected)
  });

  it('should return bestCharge', function() {
    let originalPrice = 46;
    let promotionPrice = 18;
    let outputs =calCartDishesBestCharge(originalPrice,promotionPrice);
    let expected = 28;
    expect(outputs).toEqual(expected);
  });



  it('should return receipt', function() {
    let cartDishesDetail = [{
      "id":"ITEM0001",
      "name":"黄焖鸡",
      "price":18.00,
      "count":2
    },
      {
        "id":"ITEM0030",
        "name":"冰锋",
        "price":2.00,
        "count":5
      }];
    let bestCharge = 28;
    let promotionType = "指定菜品半价";
    let outputs =generateReceipt(cartDishesDetail,promotionType,bestCharge);
    let expected = `
============= 订餐明细 =============
黄焖鸡 x 2 = 36元
冰锋 x 5 = 10元
-----------------------------------
使用优惠:
指定菜品半价，省18元
-----------------------------------
总计：28元
===================================`.trim();
    expect(JSON.stringify(outputs)).toEqual(expected);
  });
});
