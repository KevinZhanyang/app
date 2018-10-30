//
import Config from '../lib/config';
import { Http } from '../lib/http';

//
export class Packet
{
    // 按分页方式读取本ARTICLE对应的所有红包列表
    static get(data)
    {
        //
        return new Promise(function(resolve, reject){
            //
            let url = Config.host + '/packet/';
            let options = {
                url: url,
                method:'get',
                data: data,
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

    // 获取某个红包信息 
    /*
    static item(id) 
    {
        //
        return new Promise(function(resolve, reject){
            //
            let url = Config.host + '/packet/' + id;
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
    */

    //
    static post(articleId)
    {
        //
        return new Promise(function(resolve, reject){
            //
            let url = Config.host + '/packet';
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
    static can(articleId) 
    {
        //
        return new Promise(function(resolve, reject){
            //
            let url = Config.host + '/article/' + articleId + '/packet/can';
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
    static recentItem() 
    {
        //
        return new Promise(function(resolve, reject){
            //
            let url = Config.host + '/recent_packet';
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
    static count(articleId) 
    {
        //
        return new Promise(function(resolve, reject){
            //
            let url = Config.host + '/article/' + articleId + '/packet/count';
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