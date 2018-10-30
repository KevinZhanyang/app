//
import Config from '../lib/config';
import { Http } from '../lib/http';

//
export class Province
{
	// 
    static get (parameter = {}){
        //
        return new Promise(function(resolve, reject){
        	//
        	let url = Config.host + '/province';
        	let options = {
        		url: url,
                data: parameter,
        	};

        	//
        	Http.executeWithLogin(options).then(function(data){
        		// 执行成功
        		resolve(data);
        	}, function(error){
        		// 执行失败
        		reject(error);
        	});
        });
    }
    //
}