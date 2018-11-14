//
import Config from '../lib/config';
import { Http } from '../lib/http';

//
export class Task {
  //
  static getDetail() {
    //
    return new Promise(function (resolve, reject) {
      //
      let url = Config.apiRoot + '/v1/signInTask/self';
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
  //
  static create(data) {
    //
    console.log(data)
    return new Promise(function (resolve, reject) {
      //
      let url = Config.apiRoot + '/v1/signInTask/' +data.id;
      let options = {
        url: url,
        method: 'PUT',
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
}