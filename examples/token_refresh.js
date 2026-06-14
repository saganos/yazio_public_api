const fetch = require("node-fetch");

const params = new URLSearchParams();
params.append("client_id", "1_4hiybetvfksgw40o0sog4s884kwc840wwso8go4k8c04goo4c");
params.append("client_secret", "6rok2m65xuskgkgogw40wkkk8sw0osg84s8cggsc4woos4s8o");
params.append("grant_type", "refresh_token");
params.append("refresh_token", "_refresh_token_here_");

fetch('https://yzapi.yazio.com/v15/oauth/token', { method: 'post', body: params })
  .then(response => {
    if (response.status === 200) {
      return response.json();
    } else {
      throw new Error('Something went wrong on api server!');
    }
  })
  .then(response => {
    console.debug(response);
  }).catch(error => {
    console.error(error);
  });

/*
Json response:
{
  access_token: '_here_will_be_access_token_',
  expires_in: 172800,
  refresh_token: '_here_will_be_refresh_token_',
  token_type: 'bearer'
}
 */
