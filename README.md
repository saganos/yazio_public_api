Yazio API desciption
============

What
------------
Public API description for Yazio application.

Why?
------------
After waiting for more than one year for public API description I was tired.
Some functions are still missing (i.e. Share saved meal with other people) - should be easier now to create it as a `plugin / extension / additional webapp`

How to install
------------
```bash
npm i node-fetch --save
```


Examples:
------------

### Login ###
```bash
node examples/login.js
```

[login.js](examples/login.js) - Login to Yazio App with login and password using OAUTH2 

----
### Token refresh ###
```bash
node examples/token_refresh.js
```

[token_refresh.js](examples/token_refresh.js) - Refresh login token

### Get user info ###
```bash
node examples/get_user_info.js
```

[get_user_info.js](examples/get_user_info.js) - Gets user info 

