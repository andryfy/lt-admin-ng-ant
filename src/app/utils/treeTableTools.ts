import { TreeNodeInterface } from '@shared/components/tree-table/tree-table.component';

function convertTreeToList(root: TreeNodeInterface): TreeNodeInterface[] {
  const stack: TreeNodeInterface[] = [];
  const array: TreeNodeInterface[] = [];
  const hashMap = {};
  stack.push({ ...root, level: 0, expand: false, _checked: false });

  while (stack.length !== 0) {
    const node = stack.pop()!;
    visitNode(node, hashMap, array);
    if (node.children) {
      for (let i = node.children.length - 1; i >= 0; i--) {
        stack.push({ ...node.children[i], level: node.level! + 1, _checked: false, expand: false, parent: node });
      }
    }
  }

  return array;
}

function visitNode(node: TreeNodeInterface, hashMap: { [key: string]: boolean }, array: TreeNodeInterface[]): void {
  if (!hashMap[node.id]) {
    hashMap[node.id] = true;
    array.push(node);
  }
}

// Get treeData in map form, input parameter is dataList
const fnTreeDataToMap = function tableToTreeData(dataList: any[]): { [key: string]: TreeNodeInterface[] } {
  const mapOfExpandedData: { [key: string]: TreeNodeInterface[] } = {};
  dataList.forEach(item => {
    mapOfExpandedData[item.id] = convertTreeToList(item);
  });
  return mapOfExpandedData;
};

/**
 * This method is used to convert an array with a parent-child relationship into an array with a tree structure.
 * Receives an array with parent-child relationship as parameter
 * Returns an array of tree structures
 */
const fnFlatDataHasParentToTree = function translateDataToTree(data: any[], fatherId = 'fatherId'): any {
  // We believe that the data with fatherId=0 is the first-level data
  // No data for parent node
  let parents = data.filter(value => value[fatherId] === 0);

  //There is data from the parent node
  let children = data.filter(value => value[fatherId] !== 0);

  //Define the concrete implementation of the conversion method
  let translator = (parents: any[], children: any[]): any => {
    //Traverse parent node data
    parents.forEach(parent => {
      //Traverse child node data
      children.forEach((current, index) => {
        //At this time, find a child node corresponding to the parent node
        if (current[fatherId] === parent.id) {
          //Perform deep copy of child node data. Only some types of data deep copy are supported here. Children's boots who don't know about deep copy can learn about deep copy first.
          let temp = JSON.parse(JSON.stringify(children));
          //Let the current child node be removed from temp, and temp be used as the new child node data. This is to reduce the number of child node traversals during recursion. The more levels of the parent-child relationship, the more advantageous it will be.
          temp.splice(index, 1);
          //Let the current child node be the only parent node to recursively find its corresponding child node
          translator([current], temp);
          //Put the found child node into the children attribute of the parent node
          typeof parent.children !== 'undefined' ? parent.children.push(current) : (parent.children = [current]);
        }
      });
    });
  };
  //Call conversion method
  translator(parents, children);
  return parents;
};

// Add a hierarchy to the tree structure data and mark whether it is the root node, the root node isLeaf is true, and the level is represented by level
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const fnAddTreeDataGradeAndLeaf = function AddTreeDataGradeAndLeaf(array: any[], levelName = 'level', childrenName = 'children') {
  const recursive = (array: any[], level = 0): any => {
    level++;
    return array.map((v: any) => {
      v[levelName] = level;
      const child = v[childrenName];
      if (child && child.length > 0) {
        v.isLeaf = false;
        recursive(child, level);
      } else {
        v.isLeaf = true;
      }
      return v;
    });
  };
  return recursive(array);
};

// Flattened tree data
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const fnFlattenTreeDataByDataList = function flattenTreeData(dataList: any[]) {
  const mapOfExpandedData: { [key: string]: TreeNodeInterface[] } = fnTreeDataToMap(dataList);
  return fnGetFlattenTreeDataByMap(mapOfExpandedData);
};

// Obtain the flattened tree data, and the input parameter is treeData in the form of map
const fnGetFlattenTreeDataByMap = function getFlattenTreeData(mapOfExpandedData: { [key: string]: TreeNodeInterface[] }): TreeNodeInterface[] {
  const targetArray: TreeNodeInterface[] = [];
  Object.values(mapOfExpandedData).forEach(item => {
    item.forEach(item_1 => {
      targetArray.push(item_1);
    });
  });
  return targetArray;
};

export { fnTreeDataToMap, fnAddTreeDataGradeAndLeaf, fnFlatDataHasParentToTree, fnFlattenTreeDataByDataList, fnGetFlattenTreeDataByMap };
