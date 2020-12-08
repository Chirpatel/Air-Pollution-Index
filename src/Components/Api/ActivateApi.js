import axios from 'axios';

const ActivateApi = async () =>{

    var config = {
        method: 'get',
        url: 'https://air-pollution-index.glitch.me/activate',
        headers: { }
      };
      let returndata;
      await axios(config)
      .then(function (response) {
        returndata=response.data;
      })
      .catch(function (error) {
        console.log(error);
      });
      //console.log(returndata);
      return returndata;
}
export default ActivateApi;