const fetch = require("node-fetch");
global.Headers = fetch.Headers;

var myHeaders = new Headers();
myHeaders.append("Authorization", "Bearer __put_access_token_here__");

var requestOptions = {
  method: 'GET',
  headers: myHeaders,
  redirect: 'follow'
};

// Format: YYYY-MM-DD
const date = "2024-01-15";

fetch(`https://yzapi.yazio.com/v15/user/consumed-items?date=${date}`, requestOptions)
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
Json response (array of consumed items for the day):
[
  {
    id: '__consumed_item_id__',
    product_id: '__product_id__',
    date: '2024-01-15 08:30:00',
    daytime: 'breakfast',
    amount: 150,
    serving: 'g',
    serving_quantity: 100
  }
]
 */
