Yazio API description
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

Documentation
------------

A `swagger.json` file was added. You can use the public [swagger editor](https://editor-next.swagger.io/) to paste/import it and play around.

ℹ️ The OAuth part works. You can log in and retrieve a valid token.

⚠️ The other endpoints won't work in the swagger UI, as long as you are playing around using the public swagger editor. The reason is that yazio has CORS security rules enabled that can only be omitted using HTTP or localhost clients. [You can use the client credentials that are posted in this repository](https://github.com/saganos/yazio_public_api/blob/master/examples/login.js).

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

