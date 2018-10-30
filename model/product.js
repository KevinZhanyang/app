//
import Config from '../lib/config';
import { Http } from '../lib/http';

//
export class Product
{
	// 告诉产品
	static exchange(data)
	{
		//
        return new Promise(function(resole, reject){
        	//
	        let url = Config.host + '/exchange';
	        let options = {
	        	url: url,
	        	method: 'POST',
	        	data: data,
	        }
	       
	       	//
	        Http.executeWithLogin(options).then(function(result){
	        	resole(result);
	        }, function(error) {
	        	reject(error);
	        });
        });
        //
	}

	//
	static getExchanges () 
	{
		//
        return new Promise(function(resole, reject){
        	//
	        let url = Config.host + '/exchange';
	        let options = {
	        	url: url,
	        }
	       
	       	//
	        Http.executeWithLogin(options).then(function(result){
	        	resole(result);
	        }, function(error) {
	        	reject(error);
	        });
        });
        //
	}

	//
	static get (parameters) 
	{
		//
        return new Promise(function(resole, reject){
        	//
	        let url = Config.host + '/product';
	        let options = {
	        	url: url,
	        }
	       
	       	//
	        Http.executeWithLogin(options).then(function(result){
	        	resole(result);
	        }, function(error) {
	        	reject(error);
	        });
        });
        //
	}

	// 取得某个产口
	static item (id) 
	{
		//
        return new Promise(function(resole, reject){
        	//
	        let url = Config.host + '/product/' + id;
	        let options = {
	        	url: url,
	        }
	       
	       	//
	        Http.executeWithLogin(options).then(function(result){
	        	resole(result);
	        }, function(error) {
	        	reject(error);
	        });
        });
        //
	}
}