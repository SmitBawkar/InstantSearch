const fs = require('fs');
const ct = require('./CustomTrie');

/**
 * SearchApi encapsulates the search functionaity. IT exposes following public methods:
 * FindAcrossTrie() - Performs serach across 3 tries and returns fullname.
 * Initialize() - Initialize tries from csv file.
 */
function SearchApi()
{
    /**
     * Private variables:
     * masterHashTable - hash table to hold fullnames from csv file.
     * fnameTrie - Trie constructed from all the first names from the file 
     * mnameTrie - Trie constructed from all the middle names from the file
     * lnameTrie - Trie constructed from all the last names from the file
     */
    const masterHashTable = {};
    const fnameTrie = new ct.CustomTrie();
    const mnameTrie = new ct.CustomTrie();
    const lnameTrie = new ct.CustomTrie();

    /**
     * Public functions:
     * Initialize - Reads csv and loads data into hashtable and tries
     * FindAcrossTrie - returns fnames, lnames and mnames starting with the querystring ordered by ranking criteria
     */
    this.initialize = function (filePath,callback)
    {
      //  Read CSV
        fs.readFile(filePath, {encoding: 'utf-8'}, function (err, data){
            if (err)
            {
                console.log(err);
                callback('Error in Reading Csv: ',null)
            }    
            
                prepareSearchData(data);
                callback(null,data);     
        });
    }

    this.findAcrossTries = function (query)
    {
        let fnameResut =[];
        let mnameResut = [];
        let lnameResut = [];

        let fnames = fnameTrie.find(query.toLowerCase());
        let mnames = mnameTrie.find(query.toLowerCase());
        let lnames = lnameTrie.find(query.toLowerCase());
        
        //Add fullnames for which First name starts with Querry string        
        if(fnames.length > 0)
        {            
            fnames.forEach(function(item){
                if(item.masterHashTableKey !== undefined && item.masterHashTableKey.length > 0)
                {
                    item.masterHashTableKey.forEach(function(el){                        
                        fnameResut.push({
                            fullname: masterHashTable[el].split(',').join(' ')
                        });
                    });
                }
            });
         }

        //Add fullnames for which Middle name starts with Querry string
        if(mnames.length > 0)
        {            
            mnames.forEach(function(item){
                if(item.masterHashTableKey !== undefined && item.masterHashTableKey.length > 0)
                {
                    item.masterHashTableKey.forEach(function(el){                        
                        mnameResut.push({
                            fullname: masterHashTable[el].split(',').join(' ')
                        });
                    });
                }
            });
         }
         
          //Add fullnames for which Last name starts with Querry string
        if(lnames.length > 0)
        {            
            lnames.forEach(function(item){
                if(item.masterHashTableKey !== undefined && item.masterHashTableKey.length > 0)
                {
                    item.masterHashTableKey.forEach(function(el){                        
                        lnameResut.push({
                            fullname: masterHashTable[el].split(',').join(' ')
                        });
                    });
                }
            });
         }
         
      return computeRank(fnameResut,mnameResut,lnameResut);
    }


    /**
     * Rank result accoding to following priority:
     * 1. first name starts with search query order by result length in ascending order
     * 2. last name starts with search query order by result length in ascending order
     * 3. middle name starts with search query order by result length in ascending order
     */
    function computeRank(fnameResut,mnameResut,lnameResut)
    {        
        fnameResut.sort(function(a,b){return a.fullname.length - b.fullname.length});
        mnameResut.sort(function(a,b){return a.fullname.length - b.fullname.length});
        lnameResut.sort(function(a,b){return a.fullname.length - b.fullname.length});
        
        let searchResult =[];
        let rank =1;        
        //Insert fname Result in searchResultArray
        fnameResut.forEach(function(item){
            searchResult.push({'name': item.fullname,'rank':rank++}
            )});
        //Insert lname result only if it doesn't already exists.    
        lnameResut.forEach(function(item){
            if(!searchResult.some(function(resultItem){ return resultItem.name === item.fullname }))
            {
                searchResult.push({'name': item.fullname,'rank':rank++});
            }        
        });
        //Insert mname result only if it doesn't already exists. 
        mnameResut.forEach(function(item){
            if(!searchResult.some(function(resultItem){return resultItem.name === item.fullname }))
            {
                searchResult.push({'name': item.fullname,'rank':rank++});
            }        
        });

        return searchResult;
    }

    /**
     * Initializes masterHashTable and Tires with csvData
     */
    function prepareSearchData(csvData)  
    {
        loadMasterHashTable(csvData);
        //insert firstName, MiddleName and LastName in 3 different tries    
        Object.entries(masterHashTable).forEach(function([key, val]){
            let name = val.split(',');

            fnameTrie.insert(name[0].toLowerCase(),key);
            mnameTrie.insert(name[1].toLowerCase(),key);
            lnameTrie.insert(name[2].toLowerCase(),key);
        });
    }


    /**
     * Iterates over the csv data, splits on new line and stoes the fullnames(comma separated) in masterHasTable.
     */
    function  loadMasterHashTable(csvData)
    {
        //store each line in array
        let names = csvData.split('\n');
        //Remove Header Row
        names.shift();
    
        for(let i=0; i < names.length; i++)
        {
            if(names[i].trim() !== undefined && names[i].trim() !== '')
            {
                masterHashTable[i] = names[i].trim();
            }
        }        
    }

}


module.exports.SearchApi = SearchApi;
