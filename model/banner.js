
import Config from '../lib/config';
import { Http } from '../lib/http';
export class Banner {



  static getBannerList() {
    let url = Config.apiRoot + '/v1/homeBanner';
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