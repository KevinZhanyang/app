//
import Config from '../lib/config';
import { Http } from '../lib/http';
import { Upload } from '../lib/upload';

//
export class Published
{
    // 当用户编辑商品时，读取用户所发的商品（包括上架下架）
    static item(id)
    {
        //
        let url = Config.host + '/published/' + id;
        let options = {
            url: url,
            method:'get',
        }

        //
        return new Promise(function(resolve, reject){
            //
            Http.executeWithLogin(options).then(function(result){
                resolve(result);
            }, function(error) {
                reject(error);
            });
            //
        });
    }

    //
    static post(id, item) 
    {
        //
        let url = Config.host + '/published/' + id;
        let options = {
            url: url,
            method:'post',
            data: item,
        }

        //
        return new Promise(function(resolve, reject){
            //
            Http.executeWithLogin(options).then(function(result){
                resolve(result);
            }, function(error) {
                reject(error);
            });
            //
        });
    }
    // game over
}