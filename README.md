## Express-loadmeter ##

### Purpose ###

Middleware with some flexibility when logging requests made on an API.

So far the available output options are __stdout__ and __mongodb__.

### Installation ###

    npm install loadmeter

### Example ###

Check out "example" to see how it's set up.

Sample output:


     {
        "method":"GET",
        "status":200,          // HTTP status code
        "ep":"/delay/:time",   // endpoint
        "late":1004,           // latency
        "len":17,              // request length
        "meta":{               // endpoint specific data
            "time":"1000"      // the "time" parameter in the endpoint path
        }
     }


### Future improvements ###

Make it pluginable to be able to use other storage types for the data.
