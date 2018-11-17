//
import Config from '../lib/config';
import { Http } from '../lib/http';

//
export class Message
{
    //
    static item(id) 
    {
        //
        return new Promise(function(resolve, reject){
            //
            let url = Config.host + '/message/' + id;
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
  static delete(id) {
    //
    return new Promise(function (resolve, reject) {
      //
      let url = Config.apiRoot + '/v1/messages/' + id;
      let options = {
        url: url,
        method: 'delete',
      }
      //
      Http.executeWithLogin(options).then(function (result) {
        resolve(result);
      }, function (error) {
        reject(error);
      });
    });
  }   

    //
    static get(articleId)
    {
        //
        return new Promise(function(resolve, reject){
            //
            let url = Config.host + '/article/' + articleId + '/message';
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

    static post(item)
    {
        //
        return new Promise(function(resolve, reject){
            //
            let url = Config.host + '/message';
            let options = {
                url: url,
                method:'post',
                data: item,
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