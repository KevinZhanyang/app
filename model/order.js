//
import Config from '../lib/config';
import { Http } from '../lib/http';

//
export class Order
{
	// get all orders
	static get() {
        return new Promise(function(resolve, reject){
        	//
	        let url = Config.host + '/order';
	        let options = {
	        	url: url,
	        	method: 'GET',
	        };
	
	        //
	        Http.executeWithLogin(options).then(function(res){
	        	let orders = res.data;
	        	resolve(orders);
	        });
	        //
        });
	}

	// 创建租金订单
	static creatRent (orderId) {
        return new Promise(function(resolve, reject){
        	//
	        let url = Config.host + '/rent';
	        let options = {
	        	url: url,
	        	method: 'POST',
	        	data: {
	        		id: orderId,
	        	}
	        };
	
	        //
	        Http.executeWithLogin(options).then(function(res){
	        	let order = res.data;
	        	resolve(order);
	        });
	        //
        });
	}

	// 读取所有订单
	static create (productId) {
        return new Promise(function(resolve, reject){
        	//
	        let url = Config.host + '/order';
	        let options = {
	        	url: url,
	        	method: 'POST',
	        	data: {
	        		product_id: productId,
	        	}
	        };
	
	        //
	        Http.executeWithLogin(options).then(function(res){
	        	let order = res.data;
	        	resolve(order);
	        });
	        //
        });
	}
	// 读取某个订单
    static item (id){
        //
        return new Promise(function(resolve, reject){
        	//
	        let url = Config.host + '/order/' + id;
	        let options = {
	        	url: url,
	        	method: 'GET',
	        }
	
	        //
	        Http.executeWithLogin(options).then(function(res){

	        	let order = res.data;
	        	resolve(order);
	        });
	        //
        });
    }
}