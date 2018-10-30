//
import Config from '../lib/config';
import { Http } from '../lib/http';

//
export class Keyword
{
    //
    static get() 
    {
        //
        return new Promise(function(resolve, reject){
            //
            let url = Config.host + '/keyword';
            let options = {
                url: url,
                method:'get',
            }

            //
            Http.executeWithLogin(options).then(function(result){
                resolve(result);
            }, function(error) {
                reject(error);
            });
        });
    }   
    // game over
}