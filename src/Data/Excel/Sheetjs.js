import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { Row, Col, Input, Alert, Table, message } from "antd";
import "./Styles.css";
import "bootstrap/dist/css/bootstrap.min.css";

const { TextArea } = Input;
/* xlsx.js (C) 2013-present  SheetJS -- http://sheetjs.com */
/* Notes:
   - usage: `ReactDOM.render( <SheetJSApp />, document.getElementById('app') );`
   - xlsx.full.min.js is loaded in the head of the HTML page
   - this script should be referenced with type="text/babel"
   - babel.js in-browser transpiler should be loaded before this script
*/
const SheetJSApp = ({ authObj, onDataUpdate, ...props }) => {
  const [data, setData] = useState([]);
  const [showalert, setShowalert] = useState(false);
  const [colsAnt, setColsAnt] = useState([]);
  useEffect(() => {
    setShowalert(false);
    if (!authObj) return;

    if (authObj.dtlist) {
      setData(authObj.dtlist);
      setColsAnt(makeCols(authObj.dtlist));
    }
  }, []);
  const handleFile = (file /*:File*/) => {
    /* Boilerplate to set up FileReader */
    const reader = new FileReader();
    const rABS = !!reader.readAsBinaryString;
    reader.onload = (e) => {
      /* Parse data */
      const bstr = e.target.result;
      const wb = XLSX.read(bstr, { type: rABS ? "binary" : "array" });
      /* Get first worksheet */
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      /* Convert array of arrays */
      const data = XLSX.utils.sheet_to_json(ws, {
        header: 0,
      });

      /* Update state */

      setData(data);
      setColsAnt(makeCols(data));

      if (Array.isArray(data)) {
        setShowalert(false);
        onDataUpdate(authObj, data, { dtype: "excel" });
      } else setShowalert(true);
    };
    if (rABS) reader.readAsBinaryString(file);
    else reader.readAsArrayBuffer(file);
  };
  const exportFile = () => {
    /* convert state to workbook */
    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "SheetJS");
    /* generate XLSX file and send to client */
    XLSX.writeFile(wb, "sheetjs.xlsx");
  };

  return (
    <DragDropFile handleFile={handleFile}>
      <div className="row">
        <div className="col-xs-8">
          <DataInput handleFile={handleFile} />
        </div>
      </div>
      <div style={{ margin: 10, marginTop: 30 }}>
        <Row gutter={16}>
          <Col span={12}>
            <Table
              dataSource={addKey(data)}
              columns={colsAnt}
              size="small"
              pagination={{ pageSize: 15 }}
            />
          </Col>

          <Col span={12}>
            <TextArea
              rows={16}
              id="code"
              value={JSON.stringify(data, null, 1)}
            ></TextArea>
            {showalert && (
              <div style={{ marginTop: 5 }}>
                <Alert
                  message="Not array!, Select an array datafield"
                  type="error"
                />
              </div>
            )}
          </Col>
        </Row>
      </div>
    </DragDropFile>
  );
};

/*
  Simple HTML5 file drag-and-drop wrapper
  usage: <DragDropFile handleFile={handleFile}>...</DragDropFile>
    handleFile(file:File):void;
*/
const DragDropFile = (props) => {
  const suppress = (evt) => {
    evt.stopPropagation();
    evt.preventDefault();
  };
  const onDrop = (evt) => {
    evt.stopPropagation();
    evt.preventDefault();
    const files = evt.dataTransfer.files;
    if (files && files[0]) props.handleFile(files[0]);
  };

  return (
    <div onDrop={onDrop} onDragEnter={suppress} onDragOver={suppress}>
      {props.children}
    </div>
  );
};

/*
  Simple HTML5 file input wrapper
  usage: <DataInput handleFile={callback} />
    handleFile(file:File):void;
*/
const DataInput = (props) => {
  const handleChange = (e) => {
    const files = e.target.files;
    if (files && files[0]) props.handleFile(files[0]);
  };

  return (
    <form className="form-inline">
      <div className="form-group">
        <label htmlFor="file">Spreadsheet</label>
        <input
          type="file"
          className="form-control"
          id="file"
          accept={SheetJSFT}
          onChange={handleChange}
        />
      </div>
    </form>
  );
};

/* list of supported file types */
const SheetJSFT = [
  "xlsx",
  "xlsb",
  "xlsm",
  "xls",
  "xml",
  "csv",
  "txt",
  "ods",
  "fods",
  "uos",
  "sylk",
  "dif",
  "dbf",
  "prn",
  "qpw",
  "123",
  "wb*",
  "wq*",
  "html",
  "htm",
]
  .map(function (x) {
    return "." + x;
  })
  .join(",");

export const makeCols = (data) => {
  let col = [];
  if (!data) return;
  Object.keys(data[0]).map((k, i) => {
    col.push({
      title: k.charAt(0).toUpperCase() + k.slice(1),
      dataIndex: k,
      key: k,
    });
    return null;
  });
  return col;
};

const addKey = (data) => {
  let newdt = [];
  if (data)
    data.map((k, i) => {
      k.key = i;
      newdt.push(k);
      return null;
    });
  return newdt;
};

export default SheetJSApp;
