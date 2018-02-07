// pages/form/form.js
var vm = null
var util = require('../../utils/util.js')

var area = require('../../utils/area.js')

var areaInfo = [];//所有省市区县数据

var provinces = [];//省

var citys = [];//城市

var countys = [];//区县

var index = [0, 0, 0];

var cellId;

var t = 0;
var show = false;
var moveY = 200;
Page({
  data: {
    isAgree: true,
    province_gps: '',   //省份
    city_gps: '',   //城市
    show: show,
    provinces: provinces,
    citys: citys,
    countys: countys,
    value: [0, 0, 0],
    showNumber: false, // 是否显示弹出框
    telList: [],  //号码池
    toast: '',  //号码池搜索框
    goods_id:'', //王卡编号
    name: '', //姓名
    cade: '', //身份证号
    tel: '',  //电话
    address: '',  // 地址 
    chooseTel: '', //选择的电话号
    hint: '根据国家实名制要求，请准确提供身份证信息',   //提示
    hintColor: false,//提示颜色
    isNallName: false,
    isNallCode: false,
    isNallTel: false,
    isNallChooseTel: false,
    isNallAddres: false
  },
  //模糊搜索
  searchNumber: function () {
    var param = {
      search_word: vm.data.toast
    }
    util.getListBySearchWord(param, function (res) {
      console.log("搜索结果 ： " + JSON.stringify(res))
      vm.setData({
        telList: res.data
      })
    })
  },

  //选择的电话号码
  chooseTel: function (e) {
    // console.log("选择的电话号：" + JSON.stringify(e))
    var tel = e.currentTarget.dataset.tel
    vm.setData({
      chooseTel: tel
    })
    vm.hiddenNumber()
  },
  //判断表单
  isNall: function () {
    if (util.judgeIsAnyNullStr(vm.data.name)) {
      vm.setData({ hint: "姓名不能为空", isNallName: true, hintColor: true })
      return
    } else {
      vm.setData({ isNallName: false })
    }
    if (util.judgeIsAnyNullStr(vm.data.code)) {
      vm.setData({ hint: "身份证不能为空", isNallCode: true, hintColor: true })
      return
    } else {
      vm.setData({ isNallCode: false })
    }
    if (util.judgeIsAnyNullStr(vm.data.tel)) {
      vm.setData({ hint: "联系电话不能为空", isNallTel: true, hintColor: true })
      return
    } else {
      vm.setData({ isNallTel: false })
    }
    if (util.judgeIsAnyNullStr(vm.data.chooseTel)) {
      vm.setData({ hint: "请选择号码", isNallChooseTel: true, hintColor: true })
      return
    } else {
      vm.setData({ isNallChooseTel: false })
    }
    if (util.judgeIsAnyNullStr(vm.data.address)) {
      vm.setData({ hint: "请填写详细地址", isNallAddres: true, hintColor: true })
      return
    } else {
      vm.setData({ isNallAddres: false })
    }
  },
  submit: function () {
    // console.log("提交表单1 ： " + JSON.stringify(address))
    vm.isNall()
    var param = {
      goods_id: vm.data.goods_id, //王卡id
      appl_name: vm.data.name,  //申请姓名
      appl_card_no: vm.data.code,  //申请人身份证
      appl_phonenum: vm.data.tel, //申请人电话号码
      phonenum_city: "营口",  //号码归属地（固定传入营口）
      select_phonenum: vm.data.chooseTel, //选中的号码
      address: vm.data.province + vm.data.city + vm.data.county + vm.data.addres //物流配送地址
    }
    util.applyWK(param, function (res) {
      console.log("提交表单 ： " + JSON.stringify(res))
    })
  },
  //随机获取号码池中未占用号码列表
  getRandomPhonenums: function () {
    wx.showLoading({
      title: '正在加载',
    })
    var param = {
      num: 10
    }
    util.getRandomPhonenums(param, function (res) {
      console.log("获取手机号码：" + JSON.stringify(res))
      vm.setData({
        telList: res.data
      })
    })
  },
  //号码池搜索框
  getInput: function (e) {
    var value = e.detail.value
    vm.setData({
      toast: value
    })
  },
  getNameInput: function (e) {
    var value = e.detail.value
    // console.log("弹出输入框 ： " + value)
    vm.setData({
      name: value
    })
  },
  getCodeInput: function (e) {
    var value = e.detail.value
    // console.log("弹出输入框 ： " + value)
    vm.setData({
      code: value
    })
  },
  getTelInput: function (e) {
    var value = e.detail.value
    // console.log("弹出输入框 ： " + value)
    vm.setData({
      tel: value
    })
  },
  getAddresInput: function (e) {
    var value = e.detail.value
    // console.log("弹出输入框 ： " + value)
    vm.setData({
      addres: value
    })
  },

  //显示弹窗
  showToast: function () {
    vm.setData({
      showNumber: true
    })
    vm.getRandomPhonenums()//随机获取号码池中未占用号码列表
  },
  //隐藏弹窗
  hiddenNumber: function () {
    vm.setData({
      showNumber: false
    })
  },
  //滑动事件
  bindChange: function (e) {
    var val = e.detail.value
    // console.log(e)
    //判断滑动的是第几个column
    //若省份column做了滑动则定位到地级市和区县第一位
    if (index[0] != val[0]) {
      val[1] = 0;
      val[2] = 0;
      getCityArr(val[0], this);//获取地级市数据
      getCountyInfo(val[0], val[1], this);//获取区县数据
    } else {    //若省份column未做滑动，地级市做了滑动则定位区县第一位
      if (index[1] != val[1]) {
        val[2] = 0;
        getCountyInfo(val[0], val[1], this);//获取区县数据
      }
    }
    index = val;

    console.log(index + " => " + val);

    //更新数据
    this.setData({
      value: [val[0], val[1], val[2]],
      province: provinces[val[0]].name,
      city: citys[val[1]].name,
      county: countys[val[2]].name
    })

  },
  onLoad: function (options) {
    vm = this
    var goods_id = options.goods_id
    vm.setData({ goods_id: goods_id})
    vm.getAddress()

    cellId = options.cellId;
    var that = this;
    var date = new Date()
    console.log(date.getFullYear() + "年" + (date.getMonth() + 1) + "月" + date.getDate() + "日");
    //获取省市区县数据
    area.getAreaInfo(function (arr) {
      areaInfo = arr;
      //获取省份数据
      getProvinceData(that);
    });
  },

  //单选框
  bindAgreeChange: function (e) {
    this.setData({
      isAgree: !!e.detail.value.length
    });
  },
  //定位获取当前位置
  getAddress: function (e) {
    console.log("获取经纬 ： " + JSON.stringify(e))    
    wx.getLocation({
      success: function (res) {
        console.log("获取经纬 ： " + JSON.stringify(res))
        var param = {
          lat: res.latitude,
          lon: res.longitude
        }
        util.getAddress(param, function (res) {
          console.log("根据经纬获取地址 ： " + JSON.stringify(res))
          var province = res.data.ret.result.address_component.province //省份
          var city = res.data.ret.result.address_component.city    //城市
          vm.setData({
            province_gps: province,
            city_gps: city
          })
          // if (util.judgeIsAnyNullStr(province)){
          //   vm.getAddress()
          // }
        })
      },
    })
  },
  // ------------------- 分割线 --------------------
  onReady: function () {
    this.animation = wx.createAnimation({
      transformOrigin: "50% 50%",
      duration: 0,
      timingFunction: "ease",
      delay: 0
    }
    )
    this.animation.translateY(200 + 'vh').step();
    this.setData({
      animation: this.animation.export(),
      show: show
    })
  },
  //移动按钮点击事件
  translate: function (e) {
    if (t == 0) {
      moveY = 0;
      show = false;
      t = 1;
    } else {
      moveY = 200;
      show = true;
      t = 0;
    }
    animationEvents(this, moveY, show);
  },
  //隐藏弹窗浮层
  hiddenFloatView(e) {
    console.log(e);
    moveY = 200;
    show = true;
    t = 0;
    animationEvents(this, moveY, show);
  },
  tiaozhuan() {
    wx.navigateTo({
      url: '../../pages/modelTest/modelTest',
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})



//动画事件
function animationEvents(that, moveY, show) {
  console.log("moveY:" + moveY + "\nshow:" + show);
  that.animation = wx.createAnimation({
    transformOrigin: "50% 50%",
    duration: 400,
    timingFunction: "ease",
    delay: 0
  }
  )
  that.animation.translateY(moveY + 'vh').step()

  that.setData({
    animation: that.animation.export(),
    show: show
  })

}

// ---------------- 分割线 ---------------- 

//获取省份数据
function getProvinceData(that) {
  var s;
  provinces = [];
  var num = 0;
  for (var i = 0; i < areaInfo.length; i++) {
    s = areaInfo[i];
    if (s.di == "00" && s.xian == "00") {
      provinces[num] = s;
      num++;
    }
  }
  that.setData({
    provinces: provinces
  })

  //初始化调一次
  getCityArr(0, that);
  getCountyInfo(0, 0, that);
  that.setData({
    province: "北京市",
    city: "市辖区",
    county: "东城区",
  })

}

// 获取地级市数据
function getCityArr(count, that) {
  var c;
  citys = [];
  var num = 0;
  for (var i = 0; i < areaInfo.length; i++) {
    c = areaInfo[i];
    if (c.xian == "00" && c.sheng == provinces[count].sheng && c.di != "00") {
      citys[num] = c;
      num++;
    }
  }
  if (citys.length == 0) {
    citys[0] = { name: '' };
  }

  that.setData({
    city: "",
    citys: citys,
    value: [count, 0, 0]
  })
}

// 获取区县数据
function getCountyInfo(column0, column1, that) {
  var c;
  countys = [];
  var num = 0;
  for (var i = 0; i < areaInfo.length; i++) {
    c = areaInfo[i];
    if (c.xian != "00" && c.sheng == provinces[column0].sheng && c.di == citys[column1].di) {
      countys[num] = c;
      num++;
    }
  }
  if (countys.length == 0) {
    countys[0] = { name: '' };
  }
  that.setData({
    county: "",
    countys: countys,
    value: [column0, column1, 0]
  })
}