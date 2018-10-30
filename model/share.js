//
import Config from '../lib/config';
import { Http } from '../lib/http';

//
export class Share
{
    // 取得分享到朋友圈的照片
    static getCircleImg(articleId)
    {
        //
        return new Promise(function(resolve, reject){
            //
            let url = Config.host + '/article/' + articleId + '/circle';
            let options = {
                url: url,
                method:'get',
                data: {
                    // article_id: articleId,
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

    // 取得分享到朋友圈或好友的照片
    static getShareImg(articleId)
    {
        //
        return new Promise(function(resolve, reject){
            //
            let url = Config.host + '/article/' + articleId + '/share';
            let options = {
                url: url,
                method:'get',
                data: {
                    // article_id: articleId,
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

    //
    static post()
    {
        //
        return new Promise(function(resolve, reject){
            //
            let url = Config.host + '/share';
            let options = {
                url: url,
                method:'post',
                data: {
                    // article_id: articleId,
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

    // game over
}