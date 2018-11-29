
import Config from '../lib/config';
import { Http } from '../lib/http';
import { Upload } from '../lib/upload';

//
export class Activity {




  // 删除图片
  static getActivity() {
    let url = Config.apiRoot + '/v1/activityCode/person';
    let options = {
      url: url,
      method: 'GET',

    }
    return new Promise(function (resolve, reject) {
      //
      Http.executeWithLogin(options).then(function (result) {
        resolve(result);
      }, function (error) {
        reject(error);
      });
    });

  
  }

}