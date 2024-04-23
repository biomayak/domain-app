import { directoryTree, TreeNode } from './directoryTree';

// Method to list the contents of a directory
const handleListCommand = (currentPath, arg) => {
  try {
    const currentNode = arg ? pathToTreeNode(`${currentPath}/${arg}`) : pathToTreeNode(currentPath);
    if (!currentNode) {
      throw new Error(`Directory not found: ${currentPath}`);
    }

    // Extract names and types of subdirectories and executable files
    const items = currentNode.children.map(item => {
      return {
        name: item.key,
        type: item.value ? 'shell script' : 'directory',
        permissions: item.permissions
      };
    });

    // Format the output string
    let output = '';
    items.forEach((item, index) => {
      output += `${item.permissions} ${item.name}${'.'.repeat(27-item.name.length)}${item.type}`;
      if (index !== items.length - 1) {
        output += '\n'; // Add newline character if it's not the last item
      }
    });

    return output;
  } catch (e) {
    return(`ls: ${e.message}`); // Return error message if directory not found
  }
};

const handleCdCommand = (currentPath, arg) => {
  if (!arg) { throw new Error('No argument was provided') }
  const resultPath = treeNodeToPath(pathToTreeNode(`${currentPath}/${arg}`));
  console.log(resultPath);
  return resultPath;
};

function handleTreeCommand(currentPath, rootNode = directoryTree) {

  const printNode = node => {
    console.log(treeNodeToPath(node));
    return (treeNodeToPath(node) === currentPath) ? `${node.key} <` : node.key;
  }
  const getChilden = node => node.children;

  function printTree(
    initialTree,
    printNode,
    getChildren,
  ) {
    let output = '';

    function printBranch(tree, branch) {
      const isGraphHead = branch.length === 0;
      const children = getChildren(tree) || [];

      let branchHead = '';

      if (!isGraphHead) {
        branchHead = children && children.length !== 0 ? '┬ ' : '─ ';
      }

      const toPrint = printNode(tree, `${branch}${branchHead}`);

      if (typeof toPrint === 'string') {
        output += `${branch}${branchHead}${toPrint}\n`;
      }

      let baseBranch = branch;

      if (!isGraphHead) {
        const isChildOfLastBranch = branch.slice(-2) === '└─';
        baseBranch = branch.slice(0, -2) + (isChildOfLastBranch ? '  ' : '│ ');
      }

      const nextBranch = baseBranch + '├─';
      const lastBranch = baseBranch + '└─';

      children.forEach((child, index) => {
        printBranch(child, children.length - 1 === index ? lastBranch : nextBranch);
      });
    }

    printBranch(initialTree, '');

    return output;
  }

  return printTree(rootNode, printNode, getChilden);
}

function handleMkdirCommand(currentPath, folderName) {

  if (!folderName) {
    throw new Error('No folder name provided');
  }
  
  const currentNode = pathToTreeNode(currentPath);
  currentNode.children.forEach((child) => {
    if (child.key === folderName) { throw new Error(`Folder ${folderName} already exists`)}
  })
  const newNode = new TreeNode(folderName, null, 'rw-');
  newNode.parent = currentNode;
  currentNode.children.push(newNode);

  // Store the updated directory tree
  const flattenedTree = directoryTree.flattenTree();
  localStorage.setItem('directoryTree', JSON.stringify(flattenedTree));

  return `Created directory: ${folderName}`;
}

function handleRmCommand(currentPath, target) {
  
  if (!target) {
    throw new Error('No target provided');
  }

  const currentNode = pathToTreeNode(currentPath);
  const targetNode = pathToTreeNode(`${currentPath}/${target}`);
  const targetChildNodes = [...targetNode.children];

  if (!targetNode) {
    throw new Error(`Target not found: ${target}`);
  }

  if (targetNode.permissions.split('')[1] !== 'w') {
    throw new Error('Access denied');
  }

  if (targetNode === currentNode) {
    throw new Error('Cannot remove directory');
  }

  currentNode.children = currentNode.children.filter((child) => child !== targetNode);

  // Move the node's children to its parent
  targetChildNodes.forEach((child) => {
    child.parent = currentNode;
    currentNode.children.push(child);
  });

  // Store the updated directory tree
  const flattenedTree = directoryTree.flattenTree();
  localStorage.setItem('directoryTree', JSON.stringify(flattenedTree));
 
  return `Removed: ${target}`;
}

// Function to convert a TreeNode into a path string
function treeNodeToPath(node, path = '') {
  if (!node.parent) {
    return `home${path}`;
  }
  return treeNodeToPath(node.parent, `/${node.key}${path}`);
}

// Function to convert a path string into a TreeNode
function pathToTreeNode(path, rootNode = directoryTree) {
  const pathComponents = path.split('/').filter(component => component !== '');
  let currentNode = rootNode;
  for (const component of pathComponents) {

    if (component ==='home') { continue; }

    let nextNode;
    if (component === '..') {
      nextNode = currentNode.parent;
    } else if (component === '.') {
      nextNode = currentNode;
    } else  if (component === '~') {
      nextNode = rootNode;
    } else{
      nextNode = currentNode.children.find(child => child.key === component)
    }
    
    if (!nextNode) {
      throw new Error(`Invalid path: ${path}`);
    }
    currentNode = nextNode;
  }

  console.log(currentNode.key);
  return currentNode;
}




export { handleMkdirCommand, handleRmCommand, handleListCommand, handleCdCommand, handleTreeCommand };