export class TreeNode {
  constructor(id, name) {
    this.id = id;
    this.name = name;
    this.children = [];
  }

  addChild(node) {
    this.children.push(node);
  }
}

export class NAryTree {
  constructor(rootId = 'all', rootName = 'Todos los productos') {
    this.root = new TreeNode(rootId, rootName);
  }

  findNode(id, current = this.root) {
    if (current.id === id) return current;
    for (const child of current.children) {
      const found = this.findNode(id, child);
      if (found) return found;
    }
    return null;
  }

  insert(parentId, id, name) {
    const parent = this.findNode(parentId);
    if (!parent) return false;
    parent.addChild(new TreeNode(id, name));
    return true;
  }

  flatten(current = this.root, prefix = '') {
    const label = prefix ? `${prefix} / ${current.name}` : current.name;
    let list = [{ id: current.id, label }];
    for (const child of current.children) {
      list = list.concat(this.flatten(child, current.id === 'all' ? '' : current.name));
    }
    return list;
  }
}