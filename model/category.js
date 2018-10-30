//
import Config from '../lib/config';
import { Http } from '../lib/http';

//
export class Category
{
    static get (){
        //
        return new Promise(function(resolve, reject){
            //
            let url = Config.host + '/category';
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
        //
    }

    //
    static item (id) {
        //
        return new Promise(function(resolve, reject){
            //
            let url = Config.host + '/category/' + id;
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