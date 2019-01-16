
$(function () {       
    /*Hook up Button On Click event*/
    $('#btn_search').off().on('click',search);

});


/**
 * Search Function to find search query in CSV data
 */
function search()
{
      //Get searchQuery from search text box
      var searchQuery = $('#txt_search').val();

      //Ajax request to find given searchQuery
      $.ajax({
          url: "/search",
          type: "GET",
          data: {queryStr: searchQuery},
          success: function(response) {bindResponse(response)},
          error: function(xhr) {showError(xhr.responseJSON.message)}});
}



/**
 * helper functions:
 *  1. bindResponse() - Binds Jason data to html table.
 *                      If blank data is received, show no data found error
 *  2. showError()    - Shows data not found and serach string valdiation errors.
 *       
 */
function bindResponse(response)
{
        //Hide error div and emplty table before each search
        //empty table body
        $('#div_error').hide();
        $('#tbl_Search_result').find('tbody').empty();

        var tbody = $('#tbl_Search_result').find('tbody');
        tbody.empty();

        if( response !== undefined  &&  response.length > 0)
        {
          //show table header(which is hidden on pageload)
          $('#tbl_Search_result').find('thead').show();
          
          //append table rows from response  
          for(var i=0; i< response.length;i++)        
              tbody.append('<tr><td>'+response[i].name+'</td><td>'+response[i].rank+'</td></tr>')      
        }
        else
          showError('No Match Found');
    
}

function showError(errMsg)
{
        $('#tbl_Search_result').find('thead').hide();
        $('#tbl_Search_result').find('tbody').empty();
        $('#div_error').find('span').html(errMsg);
        $('#div_error').show();
}
