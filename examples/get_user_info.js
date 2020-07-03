const fetch = require("node-fetch");
global.Headers = fetch.Headers;

var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");
myHeaders.append("Authorization", "Bearer __put_access_token_here__");

var requestOptions = {
  method: 'GET',
  headers: myHeaders,
  redirect: 'follow'
};

fetch('https://yzapi.yazio.com/v5/user', requestOptions)
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
  diet: {
    carb_percentage: 30,
    fat_percentage: 30,
    protein_percentage: 30,
    name: 'default'
  },
  is_premium: false,
  email: '__your_email__',
  pal: 0,
  sex: 'male',
  first_name: null,
  last_name: null,
  city: null,
  weight_change_per_week: 0,
  body_height: 110,
  goal: 'lose',
  date_of_birth: '1983-05-06',
  registration_date: '2020-01-17 21:23:04',
  locale: '_code_',
  timezone_offset: 0,
  last_active_date: '2020-01-02',
  unit_length: 'cm',
  unit_mass: 'kg',
  unit_glucose: 'mgdl',
  unit_serving: 'g',
  unit_energy: 'kcal',
  profile_image: null,
  user_token: '__your_user_token__',
  start_weight: 64,
  email_confirmation_status: 'confirmed',
  login_type: 'email_password',
  siwa_user_id: null
}

 */
