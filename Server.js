const express = require('express');
const app = express();
const path = require('path');
const  instantSearch = require('./Search/InstantSearch');
const SearchApi = new instantSearch.SearchApi();

/**
 * Routes:
 * 1. '/' - Returns the default index.hml page
 * 2. '/search' - route for search API
 */
app.get('/',function(req,res) 
{
    res.sendFile(path.join(__dirname,'/views/index.html'));
});

app.get('/search',function(req,res)
{
    let searchQuery = req.query.queryStr;
    
    if(searchQuery !== '' && searchQuery !== undefined && searchQuery.length >= 3)
    {
        //search and send response
         res.json(SearchApi.findAcrossTries(searchQuery.trim()));  
    }
    else
    {
        res.status(400).json({status: 400, message: 'Search query should be greater than 3 chars'});
    }    
    
});



/**
 * Middle wares to handle static content and error handler
 */
app.use(function (err, req, res, next) {
    console.log(err);
    res.status(500).json({status: 500, message: 'Something Broke!'})
});   

app.use('/public',express.static(path.join('public')));




/**
 * Initialize Serach API and start server 
 * 
 */
SearchApi.initialize('./Files/Data.csv',function (err, data) {
    if (err) {
        console.log('Server cannot be started: '+err);
        return;
    }

    app.listen(8080, function() {
        console.log('listening on port: 8080');
    });
});

