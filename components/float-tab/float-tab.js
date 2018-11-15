// components/float-tab/float-tab.js
Component({
  properties: {
    switch:{
      type:String,
      value:"recent"
    },
    items: {
      type: Array,
      value: [],
    },
    fixedBar: {
      type: Boolean,
      value: false,
      observer: "onScroll"
    }
  },

  data: {
    showFixedBar: false,
    switch:"recent"
  },

  methods: {
    onTabItemClick(e) {
      console.log(e)
      this.setData({
        switch:e.currentTarget.dataset.switch
      })
      this.triggerEvent('myevent', { switch: e.currentTarget.dataset.switch });
      
    },
    onScroll() {
      this.setData({
        showFixedBar: this.data.fixedBar
      });
    }
  }
})
