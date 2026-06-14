const fetch = require("node-fetch");
global.Headers = fetch.Headers;

var myHeaders = new Headers();
myHeaders.append("Authorization", "Bearer __put_access_token_here__");

var requestOptions = {
  method: 'GET',
  headers: myHeaders,
  redirect: 'follow'
};

// Adjust query, sex, countries, and locales to match your account settings
const query = "apple";
const sex = "male";
const countries = "DE";
const locales = "de_DE";

const url = `https://yzapi.yazio.com/v15/products/search?query=${encodeURIComponent(query)}&sex=${sex}&countries=${countries}&locales=${locales}`;

fetch(url, requestOptions)
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
Json response (array of search results):
[
  {
    product_id: '__product_id__',
    name: 'Apple',
    producer: '',
    serving: 'g',
    serving_quantity: 100,
    amount: 100,
    base_unit: 'g',
    nutrients: {
      'energy.energy': 0.52,
      'nutrient.protein': 0.003,
      'nutrient.fat': 0.002,
      'nutrient.carb': 0.138
    },
    is_verified: true
  }
]
 */
