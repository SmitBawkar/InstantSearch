/**
 * Following is a custom trie implementation.
 * Along with end flag, a reference to the full name is stored at the end of the word.
 * Add function is modified to insert this reference at the time end of word falg is set to true.
 * find function is modifed to return all the word(starting with search query) along with the full name refernce. 
 */


function TrieNode(key) {
    // the "key" value will be the character in sequence
    this.key = key;
    
    // we keep a reference to parent
    this.parent = null;
    
    // we havereference of children
    this.children = {};
    
    // end of word flag
    this.end = false;

    //masterHashTabkeKey is the key coressponding to fullname
    this.masterHashTableKey = [];
  }
  
  // iterates through the parents to get the word.
  // time complexity: O(k), k = word length
  TrieNode.prototype.getWord = function() {
    var output = [];
    var node = this;
    
    while (node !== null) {
      output.unshift(node.key);
      node = node.parent;
    }
    
    return output.join('');
  };
  

  
  // we implement Trie with just a simple root with null value.
  function Trie() {
    this.root = new TrieNode(null);
  }
  
  /**
   * Insert(Add) function implementaion
   */
  Trie.prototype.insert = function(word,masterHashTableKey) {
    var node = this.root; // we start at the root
    
    // for every character in the word
    for(var i = 0; i < word.length; i++) {
      // check to see if character node exists in children.
      if (!node.children[word[i]]) {
        // if it doesn't exist, we then create it.
        node.children[word[i]] = new TrieNode(word[i]);
        
        // we also assign the parent to the child node.
        node.children[word[i]].parent = node;
      }
      
      // proceed to the next depth in the trie.
      node = node.children[word[i]];
      
      // finally, we check to see if it's the last word.
      if (i == word.length-1) {
        // if it is, we set the end flag to true and store the masterHashTableKey reference
        node.end = true;
        node.masterHashTableKey.push(masterHashTableKey);
      }
    }
  };

  /**
   * Find function implementation. Returns all words(starting with given prefix) along with thier full name references.
   * time complexity: O(p + n), p = prefix length, n = number of child paths
   */
  
  Trie.prototype.find = function(prefix) {
    var node = this.root;
    var output = [];
    
    // for every character in the prefix
    for(var i = 0; i < prefix.length; i++) {
      // make sure prefix actually has words
      if (node.children[prefix[i]]) {
        node = node.children[prefix[i]];
      } else {
        // there's none. just return it.
        return output;
      }
    }
    
    // recursively find all words in the node
    findAllWords(node, output);    
    return output;
  };
  
  // recursive function to find all words in the given node.
  function findAllWords(node, arr) {
    // base case, if node is at a word, push to output
    if (node.end) {
      arr.push(
        {
          'name': node.getWord(),
          'masterHashTableKey': node.masterHashTableKey
        }
      );
    }    
    // iterate through each children, call recursive findAllWords
    for (var child in node.children) {
      findAllWords(node.children[child], arr);
    }
  }


module.exports.CustomTrie = Trie;
