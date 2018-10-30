//
import Config from '../lib/config';
import { Http } from '../lib/http';

//
export class Notify
{
    //
    static count()
    {
        //
        return new Promise(function(resolve, reject){
            //
            let url = Config.host + '/notify/count';
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

    //
    static get()
    {
        //
        return new Promise(function(resolve, reject){
            //
            let url = Config.host + '/notify';
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

    // 把通知更改为已读
    static patchRead(id)
    {
        //
        return new Promise(function(resolve, reject){
            //
            let url = Config.host + '/notify/' + id + '/read';
            let options = {
                url: url,
                method:'put',
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