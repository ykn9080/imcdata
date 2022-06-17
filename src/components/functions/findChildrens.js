import _ from "lodash";

//하위의 모든 자식을 리턴하는 프로그램
//Call find children function for 1004
// findChildrens(arr, "1004", [], res => {
//   console.log("result for 1004", res);
// });

// const arr = [
//   { id: "1001", depth: "1", pid: "0" },
//   { id: "1002", depth: "1", pid: "0" },
//   { id: "1003", depth: "2", pid: "1001" },
//   { id: "1004", depth: "2", pid: "1001" },
//   { id: "1005", depth: "3", pid: "1003" },
//   { id: "1006", depth: "3", pid: "1004" },
//   { id: "1007", depth: "4", pid: "1006" },
//   { id: "1008", depth: "4", pid: "1006" },
//   { id: "1009", depth: "5", pid: "1008" }
// ];

export default function findChildrens(data, id, oputArr, callback) {
  let filterArr = data.filter(({ pid }) => pid === id);
  if (filterArr.length) {
    //Concat array with filtered data
    oputArr = [...oputArr, ...filterArr.map(({ id }) => id)];
    //Recursive call for again search next node data
    findChildrens(data, oputArr[oputArr.length - 1], oputArr, callback);
  } else {
    //If find
    callback(oputArr);
  }
}
//pid를 parent로 갖는 objects만 추출
export const directChild = (data, pid, seq) => {
  return data
    .filter((subitem, itemIndex) => subitem.pid === pid)
    .sort(function (a, b) {
      return a[seq] < b[seq] ? -1 : 1;
    });
};

let res = [];
//not callback childFind(data,"id");
export const findChild = (data, id, sortFields, sortOrder) => {
  data.forEach((obj) => {
    if (obj.pid === id) {
      res.push(obj);
      _.remove(data, (dt) => dt.id === id);
      findChild(data, obj.id);
    }
  });
  //res = _.uniqBy(res, "id");
  if (typeof sortFields !== "undefined")
    res = sortBy(res, sortFields, sortOrder);
  return res;
};

//fields:['a','b'], orderby:['asc','asc']
// var data = [{
//   a: 'a',
//   b: 2
// }, {
//   a: 'a',
//   b: 1
// }]
export const sortBy = (data, fields, orderby) => {
  if (typeof orderby === "undefined") orderby = [];
  return _.sortBy(data, fields, orderby);
};

export function getChildren(collection, ids) {
  //getChildren (data.children, '10165381978')
  //

  // store ids in this variable
  var result = [];
  // determines if an id is found,
  var found = false;

  // makes sure that ids is always an array of id
  ids = [].concat(ids);

  // iterate over the collection, name the callback for recursion
  // if you prefer to use lodash, then use:
  // _.each(collection, function iterator(value) {...});
  collection.forEach(function iterator(value) {
    // Matching the list of `ids` from the iterated userId.
    // If a match is found, then we set `found` to true.
    var isStop = ~ids.indexOf(value._id) && (found = true);

    // did we get a match?
    if (found) {
      // add the matched ID and the IDs from its descendants
      result.push(value);
    }

    // itereate recursively over its descendants
    // If you prefer to use lodash then use:
    // _.each(value.children, iterator)
    (value.children || []).forEach(iterator);

    // is the currently iterated item's ID within the list of `ids`?
    if (isStop) {
      // set `found` to false, to prevent adding IDs that aren't matched
      found = false;
    }
  });

  // return an array of IDs
  return result;
}

export function getChildrenPid(collection, Pids) {
  var result = [];
  var found = false;
  Pids = [].concat(Pids);
  collection.forEach(function iterator(value) {
    var isStop = ~Pids.indexOf(value.pid) && (found = true);
    if (found) {
      result.push(value);
    }
    (value.children || []).forEach(iterator);
    if (isStop) found = false;
  });
  return result;
}
