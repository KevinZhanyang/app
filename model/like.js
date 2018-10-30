//
import Config from '../lib/config';
import { Http } from '../lib/http';

//
export class Like
{
    //
    static get(articleId) 
    {
        //
        return new Promise(function(resolve, reject){
            //
            let url = Config.host + '/like/' + articleId;
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
    static post(articleId)
    {
        //
        return new Promise(function(resolve, reject){
            //
            let url = Config.host + '/like';
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
    }

    static del(articleId)
    {
        //
        return new Promise(function(resolve, reject){
            //
            let url = Config.host + '/like/' + articleId;
            let options = {
                url: url,
                method:'delete',
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
    // game over
}