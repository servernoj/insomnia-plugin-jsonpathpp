# JSONPath++ Insomnia plugin

## Purpose

This plugin enhances functionality of the built-in JSONPath plugin by adding ability to pass **JSON object** on top of existing functionality that allows string input only. 

The plugin treats all visible environment variables as branches of a tree that in turn represent sub-trees on their own. For example, consider the following list of environment variables defined on the global scope:
``` json
"users": {
  "dev": {
    "user_a:": {
      "email": "user_a@gmail.com",
      "passowrd": "abc123"
    },
    "user_b:": {
      "email": "user_b@gmail.com",
      "passowrd": "123abc"
    }
  },
  "prod": {
    "user_c:": {
      "email": "user_c@gmail.com",
      "passowrd": "xyz321"
    },
    "user_d:": "{ \"email\": \"user_d@gmail.com\", \"passowrd\": \"321xyz\" }"
  }
}
```
and two sub-environments `dev` and `prod` with the following lists of defined environment variables:
``` json
{
  "env": "dev",
  "user": "{% jsonpathpp 'users.dev.user_a' %}" ,
  "email": "{% jsonpathpp 'user.email' %}",
  "password": "{% jsonpathpp 'user.password' %}" 
}
```
and
``` json
{
"env": "prod",
  "user": "{% jsonpathpp 'users.prod.user_c' %}",
  "email": "{% jsonpathpp 'user.email' %}",
  "password": "{% jsonpathpp 'user.password' %}" 
}
```
with `jsonpathpp` being plugin's template tag to be, for example,  displayed as `users.prod.user_c'` in case of definition `{% jsonpathpp 'users.prod.user_c' %}`

Please note that `users.prod.user_d` in global scope is defined as a parseable JSON string which will be internally parsed and replaced as:
``` json
{
  "email": "user_d@gmail.com", 
  "passowrd": "321xyz"
}
```

Then, for example, you might have a login request that takes JSON object for user credentials, so we can populate request body as
``` json
{
  "email": "{% jsonpathpp 'email' %}",
  "password": "{% jsonpathpp 'password' %}"
}
```
which will be automatically substituted with correct values when you switch between `dev` and `prod` sub-environments.

## Disclaimer

This plugin is nothing more but a wrapper to existing functionality. Its ultimate goal is to add some convenience to the process of switching between sub-environments and selecting proper subset of values inside selected sub-environment (in our above example, switching of a current `dev` user can be achieved be replacing value of `user` variable from `{% jsonpathpp 'users.dev.user_a' %}` to `{% jsonpathpp 'users.dev.user_b' %}` in tag editor UI).

## Credit

Under the hood this plugin uses [JSONPath NPM module](https://www.npmjs.com/package/jsonpath) for processing of provided JSONPath. As fun exercise reward yourself by playing with [**The Store**](https://github.com/dchester/jsonpath#jsonpath-syntax) example that you can copy over into Insomnia environment from module README file. 