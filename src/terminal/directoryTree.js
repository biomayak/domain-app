class TreeNode {
  constructor(key, value = null, permissions = 'r--') {
    this.key = key;
    this.value = value;
    this.permissions = permissions;
    this.children = [];
    this.parent = null;
  }

  flattenTree(result = []) {
    result.push({
      key: this.key,
      value: this.value,
      permissions: this.permissions,
      parentKey: this.parent ? this.parent.key : null,
    });
    this.children.forEach((child) => child.flattenTree(result));
    return result;
  }

  static rebuildTree(flatData) {
    const nodeMap = {};
    let root = null;

    flatData.forEach((item) => {
      const node = new TreeNode(item.key, item.value, item.permissions);
      nodeMap[item.key] = node;

      if (item.parentKey === null) {
        // This is the root node
        root = node;
      } else {
        const parent = nodeMap[item.parentKey];
        node.parent = parent;
        parent.children.push(node);
      }
    });

    return root;
  }
}

let directoryTree;

// Retrieve the directory tree from localStorage
const storedTreeData = localStorage.getItem('directoryTree');
if (storedTreeData) {
  const flatTree = JSON.parse(storedTreeData);
  directoryTree = TreeNode.rebuildTree(flatTree);
} else {
  
  directoryTree = new TreeNode('home');

  const chats = new TreeNode('chats');
  const apiKeys = new TreeNode('API_keys');
  const models = new TreeNode('models');
  directoryTree.children.push(chats, apiKeys, models);
  
  apiKeys.parent = directoryTree;
  chats.parent = directoryTree;
  models.parent = directoryTree;

  const openai = new TreeNode('openai');
  const anthropic = new TreeNode('anthropic');
  models.children.push(openai, anthropic);

  openai.parent = models;
  anthropic.parent = models;
  
  const chatgpt3 = new TreeNode('chatgpt3.sh', 'Open model menu', 'r-x');
  openai.children.push(chatgpt3);
  chatgpt3.parent = openai;

  const claude = new TreeNode('claude.sh', 'Open model menu', 'r-x');
  anthropic.children.push(claude);
  claude.parent = anthropic;

  // Store the initialized directory tree
  const flattenedTree = directoryTree.flattenTree();
  localStorage.setItem('directoryTree', JSON.stringify(flattenedTree));
}

export { directoryTree, TreeNode };