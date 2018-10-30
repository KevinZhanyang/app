//
import { School } from '../../model/school';
import { Province } from '../../model/province';

//
Page({
    data: {
        //
        provines:[],
        // 
        schools: [],
        //
        provinceId: 0,
        // 搜索出来的学校
        items: [],
    },
    //
    onLoad() {
        this.loadProvince();
    },
    //
    loadProvince()
    {
        //
        let that = this;
        Province.get({
            school:1,
        })
        .then(res => {
            let provinces = res.data;
            that.setData({
                provinces: provinces,
            });
            let provineId = provinces[0].id;
            that.loadSchool(provineId);
        });
    },
    updateSchool(event) {
        let currentTarget = event.currentTarget;
        let provinceId = currentTarget.dataset.id;
        this.setData({
            provinceId: provinceId,
        });
        this.loadSchool(provinceId);
    },
    //
    loadSchool(provinceId) {
        this.setData({
            provinceId: provinceId,
        });
        //
    	let that = this;
    	School.getByProvinceId(provinceId)
    	.then(result => {
    		let schools = result.data;
    		that.setData({
    			schools: schools,
    		});
    	});
    },
    //
    /* search start */
    search (event) {
        let that = this;
        let value = event.detail.value;
        School.search(value)
        .then(res => {
            let items = res.data;
            that.setData({
                items: items,
            });
        });
    },
    clear () {
        this.setData({
            items: [],
        });
    },
    /* search end */
    //
});