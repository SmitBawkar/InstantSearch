# InstantSearch

## Getting started:
- Download zip from github or do a pull
- Open root folder(InstantSearch-master) and install node dependencies, run -
````
npm install
````
- Run below command to start the server
````
node server.js
````
- Open *http://localhost:8080/* in browser


## Working:
#### Data Structure
Custom trie is used, which stores reference to full name(a line item in csv) at the end of the word.
3 tries are used to store First Name, Middle Name and Last Name. Search Query is searched across the 3 tries to find either first Name, Midddle Name or Last Name startin with the search query. The results are ranked based on the ranking logic

#### Ranking Logic
1. Names where SearchQuery matches/starts with the firstName are ranked on the basis of their full name length.
2. 2nd preference is given to matches with LastName ordered by full name length
3. last preference is middle name matches


## Further Enhancement:
1. Since Tires are used, only prefixes are matched. Suffix tree or Suffix Arrays can be used if partial substring matches are expected.
2. Only First Name, Last Name and Middle name search is supported as of now. If full name is searched(eg: John Joseph Doe), no match would be found even if there exitis this name. This can be handled by splitting the name in fname,lname,mname and then performing a search.
