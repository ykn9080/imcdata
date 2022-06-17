import React, { useState, useEffect } from "react";
import _ from "lodash";
import { Button, Popconfirm, Row, Col, Tooltip, Modal } from "antd";
import AntFormDisplay from "imcformbuilder";
import formdt from "Data/AntFormDisplay.json";
import { EditOutlined, SaveOutlined } from "@ant-design/icons";
import IconButton from "@material-ui/core/IconButton";
import { GrFormClose, GrRevert } from "react-icons/gr";
import {
  AiOutlineEyeInvisible,
  AiOutlineEye,
  AiOutlineCalculator,
  AiOutlineUngroup,
  AiOutlineGroup,
} from "react-icons/ai";
import MoreMenu from "components/SKD/MoreMenu";
import { DraggableColumns } from "components/Table/DraggableColumns";
// import { Groupby } from "./DataManipulation";
import moment from "moment";

const SingleTable = (props) => {
  const [columns, setColumns] = useState([]);
  const [tbsetting, setTbsetting] = useState();
  const [data, setData] = useState();
  const [filtered, setFiltered] = useState(); //dtlist filtered by datatype etc
  const [initCol, setInitCol] = useState();
  const [grpby, setGrpby] = useState();
  const [delColumnShow, setDelColumnShow] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  let edit = props.edit;
  if (!edit) edit = false;

  useEffect(() => {
    let data1;

    if (props.dataObj) data1 = props.dataObj;
    const rtndt = baseData(data1);
    if (rtndt) {
      if (rtndt.setting) {
        let setting = rtndt.setting;
        let size = setting.size;
        if (!size) size = "small";
        setTbsetting({ size: size });
        setting.reset = delColumnShow;
      }
      setData(rtndt);
    }

    //if (props.edit !== true) dispatch(globalVariable({ openPopup: false }));
  }, [props.dataObj]);

  useEffect(() => {
    setTbsetting(props.tbsetting);
  }, [props.tbsetting]);
  useEffect(() => {
    let rtn;
    if (data) {
      rtn = UpdateColnData(data);
      setFiltered(rtn.dtlist);
      let editcolumn = columnEditFilter(rtn.column, data.setting);
      setColumns(editcolumn);

      if (data.setting && data.setting.groupby)
        setGroupbyTable(data.setting.groupby, rtn.dtlist);
    }
  }, [data]);

  const columnEdit = (column) => {
    setIsModalVisible(true);
    setInitCol(column);
  };
  const columnDelete = (column, colsetting) => {
    let newData = { ...data };
    let delarr = [];
    if (newData.setting.delarr) delarr = [...newData.setting.delarr];
    delarr = _.uniq(_.concat(delarr, column.key));
    newData.setting.delarr = delarr;
    setData(newData);
  };

  const columnEditFilter = (columns, colsetting) => {
    if (!edit) return columns;
    if (columns)
      columns.map((column, i) => {
        const colbtns = (
          <>
            <Button
              type="link"
              size="small"
              style={{ color: "gray", marginLeft: 20, marginRight: -5 }}
              icon={<EditOutlined />}
              onClick={(e) => {
                e.preventDefault();
                columnEdit(column);
              }}
            />
            <Popconfirm
              title="Are you sure delete ?"
              placement="topLeft"
              onConfirm={(e) => {
                e.persist();
                columnDelete(column, colsetting);
              }}
              okText="Yes"
              cancelText="No"
            >
              <Button type="link" size="small" icon={<GrFormClose />} />
            </Popconfirm>
          </>
        );
        column = {
          ...column,
          title: (
            <span>
              {column.titletext} {colbtns}
            </span>
          ),
        };
        columns.splice(i, 1, column);

        return null;
      });
    return columns;
  };
  const setGroupbyTable = (initialValues, fildata) => {
    let child = [],
      plist = [];
    let columnlist = filtered;
    if (fildata) columnlist = fildata;
    if (columnlist.length > 0) {
      Object.keys(columnlist[0]).map((k, i) => {
        child.push({ text: k, value: k });

        return null;
      });
    }

    plist.push({ name: "fields", optionArray: child });
    plist.push({ name: "values", optionArray: child });

    let init = {};
    if (initialValues) init = { initialValues };

    const groupby = {
      formid: "5f45e11e9461621a00fbe013",
      patchlist: plist,
      onValuesChange: (changedValues, allValues) => {
        localStorage.removeItem("persist:root");
        localStorage.setItem("groupby", JSON.stringify(allValues));
      },
      ...init,
    };
    setGrpby(groupby);
  };
  const saveTemp = () => {
    const localtoObject = (itemname) => {
      let item = localStorage.getItem(itemname);
      if (item)
        try {
          item = JSON.parse(item);
        } catch (e) {
          console.log(e);
        }
      localStorage.removeItem(itemname);
      return item;
    };
    let grpby = localtoObject("groupby");

    let newdata = { ...data };

    let setting1 = { ...newdata.setting };

    if (setting1.delarr) {
      //calc field if deleted remove from column
      setting1.delarr.map((k, i) => {
        if (k.indexOf("calc") > -1) {
          setting1.delarr.splice(i, 1);
          _.remove(setting1.column, function (n) {
            return n.key === k;
          });
        }

        return null;
      });
    }

    if (grpby) {
      setting1.groupby = grpby;
    }

    newdata = {
      ...newdata,
      setting: {
        ...setting1,
      },
    };
    setData(newdata);
    if (props.save) props.save(newdata, props.activeKey);
  };

  const onFinishColumn = (val) => {
    //dispatch(globalVariable({ openPopup: false }));
    let newData = _.cloneDeep(data); //{ ...data };
    let columnlist = newData.setting.column || [];

    columnlist.map((k, i) => {
      if (k.key === val.key) {
        let newk = { ...k, ...val };
        columnlist.splice(i, 1, newk);
      }

      return null;
    });

    setData(newData);
    setIsModalVisible(false);
  };
  const onDragEnd = (columns) => {
    let newData = { ...data };
    let odr = [];
    columns.map((k, i) => {
      odr.push(k.key);

      return null;
    });
    newData.setting.order = odr;
    setData(newData);
  };

  const handleAction = (type) => {
    let newdata = { ...data };
    switch (type) {
      case "showcolumn":
        //newdata.setting.delarr = [];
        newdata.setting.reset = true;
        setData(newdata);
        break;
      case "hidecolumn":
        delete newdata.setting.reset;
        setData(newdata);
        break;
      case "revertcolumn":
        delete newdata.setting.reset;
        newdata.setting.delarr = [];
        setData(newdata);
        break;
      case "calc":
        let colArr = newdata.setting.column;
        let cnt = 1;
        colArr.map((k, i) => {
          if (k.key.indexOf("calc") > -1) {
            const num = parseInt(k.key.replace("calc", ""));
            if (num >= cnt) cnt = num + 1;
          }
          return null;
        });
        const cn = `calc${cnt}`;
        colArr.push({ key: cn, title: cn, origin: cn, dataIndex: cn });
        setData(newdata);
        break;
      case "groupby":
        setGroupbyTable();
        break;
      case "cancelgroupby":
        setGrpby(null);
        delete newdata.setting.groupby;
        setData(newdata);
        break;

      default:
        break;
    }
  };

  const menu = [
    {
      title: delColumnShow ? (
        <Tooltip title="Show deleted columns" style={{ zIndex: 10000 }}>
          <AiOutlineEye />
        </Tooltip>
      ) : (
        <Tooltip title="Hide deleted columns">
          <AiOutlineEyeInvisible />
        </Tooltip>
      ),
      onClick: () => {
        setDelColumnShow(!delColumnShow);
        handleAction(delColumnShow ? "hidecolumn" : "showcolumn");
      },
    },
    {
      title: (
        <Tooltip title="Revert column delete" placement="left">
          <GrRevert />
        </Tooltip>
      ),
      onClick: () => {
        if (window.confirm("Are you sure to reset column?"))
          handleAction("revertcolumn");
      },
    },
    {
      title: (
        <Tooltip title="Add calculated column" placement="left">
          <AiOutlineCalculator />
        </Tooltip>
      ),
      onClick: () => handleAction("calc"),
    },
    {
      title: !grpby ? (
        <Tooltip title="Execute group by" placement="left">
          <AiOutlineGroup />
        </Tooltip>
      ) : (
        <Tooltip title="Cancel group by" placement="left">
          <AiOutlineUngroup />
        </Tooltip>
      ),
      onClick: () => {
        handleAction(!grpby ? "groupby" : "cancelgroupby");
      },
    },
  ];
  return (
    <>
      {columns && (
        <div style={{ marginTop: 10, marginRight: 5, height: "auto" }}>
          {edit === true && (
            <>
              {grpby && <AntFormDisplay {...grpby} />}
              <Row justify="end">
                <Col>
                  <Tooltip title="Save temporarily">
                    <IconButton aria-label="save" onClick={saveTemp}>
                      <SaveOutlined />
                    </IconButton>
                  </Tooltip>
                </Col>
                <Col>
                  <MoreMenu menu={menu} handleAction={handleAction} />
                </Col>
              </Row>
            </>
          )}

          <DraggableColumns
            columns={columns}
            data={filtered}
            onDragEnd={onDragEnd}
            tbsetting={tbsetting}
          />
        </div>
      )}
      <Modal
        title="Edit Column"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        destroyOnClose={true}
        footer={[]}
      >
        <AntFormDisplay
          formArray={formdt["5f101b3289db1023b0165b1a"]}
          showtitle={true}
          onFinish={onFinishColumn}
          initialValues={initCol}
        />
      </Modal>
    </>
  );
};

export const baseData = (data1) => {
  let setting = {};
  if (!data1) return false;
  if (data1.setting) setting = data1.setting;
  let colArr,
    colCompare,
    colArr1 = [],
    diffnum = 0;

  //setting.reset = delColumnShow;
  //if (!size) size = "small";
  colArr = setting.column;
  if (colArr && data1.dtlist && data1.dtlist.length > 0) {
    colCompare = Object.keys(data1.dtlist[0]);
    let colArrColumn = [];
    colArr.map((k, i) => {
      colArrColumn.push(k.key);
      return null;
    });
    diffnum = _.difference(colArrColumn, colCompare).length;
  }
  if (!colArr | (diffnum > 0)) {
    if (data1.dtlist && data1.dtlist.length > 0 && !colArr) {
      colArr = setting.colArr || Object.keys(data1.dtlist[0]);
      colArr.map((k, i) => {
        colArr1.push({
          title: k,
          titletext: k,
          origin: k,
          dataIndex: k,
          key: k,
        });
        return null;
      });
      setting.column = colArr1;
      data1.setting = setting;
    }
  }
  return data1;
};
export function GroupColumnList(columnlist, groupby) {
  let rtn = columnlist;
  if (groupby) {
    const gfields = groupby.values.concat(groupby.fields);
    rtn = _.remove(columnlist, function (n) {
      return gfields.indexOf(n.key) > -1;
    });
  }
  return rtn;
}
// export function GroupDataList(dtList, groupby) {
//   let rtn = dtList;
//   if (groupby) {
//     const opt = {
//       groupfields: groupby.fields,
//       valuefields: groupby.values,
//       groupbytype: groupby.groupby,
//     };
//     rtn = Groupby(dtList, opt);
//   }
//   return rtn;
// }
const filterList = (filList, columnList) => {
  let filList1 = [];
  const filterColumn = (type, decimal, dateformat, data) => {
    Boolean.parse = function (str) {
      switch (str.toLowerCase()) {
        case "true":
          return true;
        case "false":
        default:
          return false;
      }
    };

    switch (type) {
      case "string":
        return data.toString();
      case "int":
        return parseInt(data);
      case "float":
        return parseFloat(data).toFixed(parseInt(decimal));
      case "bool":
        return Boolean.parse(data);
      case "datetime":
        return moment(Date.parse(data)).format(dateformat);
      default:
        break;
    }
  };

  if (filList && typeof filList === "object")
    filList.map((a, j) => {
      columnList.map((b, m) => {
        if (b.calculaterule) {
          a = {
            ...a,
            [b.key]: calcMaker(b.calculaterule, a),
          };
        }
        if (b.datatype) {
          a = {
            ...a,
            [b.key]: filterColumn(
              b.datatype,
              b.decimal,
              b.dateformat,
              a[b.key]
            ),
          };
        }
        return null;
      });
      filList1.push(a);
      return null;
    });

  return filList1;
};
const calcMaker = (rule, row) => {
  //const rule="$wgt/3+10",row={wgt:3,src:1,tgt:2}
  if (!rule) return false;
  let spl1 = [],
    cond = [],
    rtn;
  const rkey = Object.keys(row);
  const rval = Object.values(row);
  const parseRule = (splitt) => {
    spl1 = splitt.split("$");
    //["", "wgt/3+10"];
    spl1.map((k, i) => {
      rkey.map((s, j) => {
        if (k.toLowerCase().indexOf(s.toLocaleLowerCase()) > -1)
          spl1.splice(i, 1, k.replace(s, rval[j]));
        return null;
      });
      return null;
    });
    return spl1.join("");
  };
  const tryEval = (str) => {
    try {
      str = eval(str);
    } catch (e) {
      console.log(e);
    }
    return str;
  };

  cond = rule.split(",");
  if (cond.length === 3) {
    if (tryEval(parseRule(cond[0]))) {
      rtn = tryEval(parseRule(cond[1]));
    } else rtn = tryEval(parseRule(cond[2]));
  } else {
    rtn = parseRule(rule);
    rtn = tryEval(rtn);
  }

  return rtn;
};
const columnFromTable = (obj) => {
  return Object.keys(obj).map((k, i) => {
    return {
      dataIndex: k,
      key: k,
      origin: k,
      title: k,
      titletext: k,
    };
  });
};
const makeColumn = (columns, colsetting) => {
  let col = [],
    dtt = [];
  // if (editable === false) col = columns;
  // else {
  columns.map((column, i) => {
    if (i === 0 && column.titletext === "0") column.titletext = "";
    let obj = {
      title: column.titletext,
      titletext: column.titletext,
      origin: column.origin,
      dataIndex: column.dataIndex,
      key: column.key,
      sort: column.sort,
      datatype: column.datatype,
      decimal: column.decimal,
      dateformat: column.dateformat,
      render(text, record) {
        let styleset = {};
        if (record[`color.${obj.origin}`])
          styleset = { background: record[`color.${obj.origin}`] };
        return {
          props: {
            style: { ...styleset },
          },
          children: <div>{text}</div>,
        };
      },
    };
    if (!obj.title | !obj.titletext) {
      obj.title = obj.origin;
      obj.titletext = obj.origin;
    }
    if (colsetting.order) {
      obj.sort = colsetting.order.indexOf(obj.key);
    }
    if (obj.sort) obj.sorter = (a, b) => a[column] - b[column];
    if (column.origin.indexOf("color") > -1) return false;
    col.push(obj);

    dtt.push({
      key: i,
      ...column,
    });
    return null;
  });

  col = _.sortBy(col, ["sort"]);
  return col;
  //return { col: col, dt: dtt };
};
export const UpdateColnData = (data) => {
  let columnList = [];
  if (!data) return false;
  if (!data.setting) return false;
  let colArr = data.setting.column;
  //let dttlist = data.dtlist;
  let dttlist;
  if (data.originlist) dttlist = data.originlist;
  else if (data.dtlist) dttlist = data.dtlist;

  if (!colArr)
    if (dttlist) colArr = columnFromTable(dttlist[0]);
    else return false;

  let ds = data.setting;

  colArr.map((k, i) => {
    if (!(ds && ds.delarr && ds.delarr.indexOf(k.key) > -1) | ds.reset)
      columnList.push(k);
    return null;
  });
  columnList = GroupColumnList(columnList, ds.groupby);
  // dttlist = GroupDataList(dttlist, ds.groupby);

  const filList = filterList(dttlist, columnList);

  const cols = makeColumn(columnList, data.setting);

  return { dtlist: filList, column: cols };
};
export default SingleTable;
