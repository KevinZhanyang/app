
import Config from '../lib/config';
import { Http } from '../lib/http';
export class FormId {
  
  
  
  static  createUserFormId(formId) {
    let url = Config.apiRoot + '/v1/miniFormId';
    let options = {
      url: url,
      method: 'POST',
      data: {
        openId: wx.getStorageSync("user").openId,
        formId: formId,
        provider: "ess"
      }
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