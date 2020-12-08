import axios from 'axios';

const CityDataApi = async ({State,City}) =>{
    console.log(State,City);
    var config = {
        method: 'get',
        url: `https://air-pollution-index.glitch.me/search/${State}/${City}`,
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
export default CityDataApi;