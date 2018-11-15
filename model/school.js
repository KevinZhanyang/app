//
import Config from '../lib/config';
import { Http } from '../lib/http';

//
export class School
{
    static getByProvinceId(provinceId) 
    {
        //
        return new Promise(function(resolve, reject){
            //
            let url = Config.host + '/school?province_id=' + provinceId;
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

    static getCategoryByProvince ()
    {
        //
        return new Promise(function(resolve, reject){
            //
            let url = Config.host + '/school';
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

    static get (){
        //
        return new Promise(function(resolve, reject){
            //
            let url = Config.host + '/school';
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

    //
    static search (keyword) 
    {
        //
        return new Promise(function(resolve, reject){
            //
            let url = Config.host + '/school';
            let options = {
                url: url,
                method:'get',
                data: {
                    keyword: keyword,
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

  static create(data) {
    //
    return new Promise(function (resolve, reject) {
      //
      let url = Config.apiRoot + '/v1/schools';
      let options = {
        url: url,
        method: 'POST',
        data: data
      }

      //
      Http.executeWithLogin(options).then(function (result) {
        resolve(result);
      }, function (error) {
        reject(error);
      });
    });
  }

  static getMySchool() {
    //
    return new Promise(function (resolve, reject) {
      //
      let url = Config.apiRoot + '/v1/schools/my';
      let options = {
        url: url,
        method: 'get',
      }

      //
      Http.executeWithLogin(options).then(function (result) {
        resolve(result);
      }, function (error) {
        reject(error);
      });
    });
  }
}

 
