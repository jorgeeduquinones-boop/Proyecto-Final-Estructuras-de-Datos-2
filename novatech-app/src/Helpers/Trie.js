class TrieNode {
  constructor() {
    this.children = {};
    this.isEndOfWord = false;
    this.items = [];
  }
}

export class Trie {
  constructor() {
    this.root = new TrieNode();
  }

  insert(word, product) {
    let node = this.root;
    const normalized = word.toLowerCase();
    for (const char of normalized) {
      if (!node.children[char]) {
        node.children[char] = new TrieNode();
      }
      node = node.children[char];
    }
    node.isEndOfWord = true;
    node.items.push(product);
  }

  searchPrefix(prefix) {
    let node = this.root;
    const normalized = prefix.toLowerCase().trim();
    for (const char of normalized) {
      if (!node.children[char]) return [];
      node = node.children[char];
    }
    const results = [];
    this._collect(node, results);
    return results;
  }

  _collect(node, results) {
    if (node.isEndOfWord) {
      results.push(...node.items);
    }
    for (const key of Object.keys(node.children)) {
      this._collect(node.children[key], results);
    }
  }
}