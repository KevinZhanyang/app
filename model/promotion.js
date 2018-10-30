//
import Config from '../lib/config';
import { Http } from '../lib/http';

//
export class Promotion
{
    // 用户是否是合伙人
    static isPartner()
    {
        return new Promise(function(resolve, reject){
            //
            let url = Config.host + '/promotion/check';
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

    // 对换暗号
    static TradeCode(content) 
    {
        //
        return new Promise(function(resolve, reject){
            //
            let url = Config.host + '/code';
            let options = {
                url: url,
                method:'post',
                data: {
                    content: content,
                }
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
    static count (){
        //
        return new Promise(function(resolve, reject){
            //
            let url = Config.host + '/promotion/count';
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
    static post (articleId){
        //
        return new Promise(function(resolve, reject){
            //
            let url = Config.host + '/promotion';
            let options = {
                url: url,
                method:'post',
                data: {
                    article_id: articleId,
                }
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
}