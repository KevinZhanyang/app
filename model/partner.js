//
import Config from '../lib/config';
import { Http } from '../lib/http';

//
export class Partner
{
	// 
    static get (){
        //
        return new Promise(function(resolve, reject){
        	//
        	let url = Config.host + '/partner';
        	let options = {
        		url: url,
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
    static register(partner) 
    {
        //
        return new Promise(function(resolve, reject){
            //
            let url = Config.host + '/partner';
            let options = {
                url: url,
                method: 'post',
                data: partner,
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
}