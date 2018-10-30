//
import Config from '../lib/config';
import { Http } from '../lib/http';

//
export class Tenant
{
    static patchNotication (notification){
        //
        return new Promise(function(resolve, reject){
            //
            let url = Config.host + '/tenant';
            let options = {
                url: url,
                method:'PUT',
                data: {
                    notification: notification,
                }
            }

            //
            Http.executeWithLogin(options).then(function(res){
                //
                let tenant = res.data;
                resolve(tenant);
            }, function(error) {
                reject();
            });
        });
        //
    }

    //
    static get() {
    	//
        return new Promise(function(resolve, reject){
        	//
	    	let url = Config.host + '/tenant';
	    	let options = {
	    		url: url,
	    	}

    		//
    		Http.executeWithLogin(options).then(function(res){
    			//
    			let tenant = res.data;
    			resolve(tenant);
    		}, function(error) {
    			reject();
    		});
        });
        //
    }
    // game over
}