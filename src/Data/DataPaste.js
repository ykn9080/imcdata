import React, { useEffect, useState } from "react";
import { Input, Row, Col, Typography, Alert, message, Spin } from "antd";
import * as XLSX from "xlsx";

const { Title } = Typography;
const { TextArea } = Input;

const DataPaste = ({ authObj, onDataUpdate }) => {
  const [result, setResult] = useState();
  const [initVal, setInitVal] = useState();
  const [showalert, setShowalert] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (authObj && authObj.dtlist) {
      userInput(authObj.dtlist);
    }
  }, []);

  const onChange = (e) => {
    setLoading(true);
    if (IsJsonString(e.target.value)) {
      userInput(JSON.parse(e.target.value));
      setInitVal(e.target.value);
      setLoading(false);
    } else {
      csvToexcel(e.target.value);
    }
  };
  function IsJsonString(str) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }
  const csvToexcel = (inputdt) => {
    var data = new Buffer(inputdt); //"1;2;3\n4;5;6"
    var wb = XLSX.read(data, { type: "buffer" });
    var js = XLSX.utils.sheet_to_json(wb.Sheets.Sheet1, {
      header: 1,
      raw: true,
    });

    js.map((k, i) => {
      k.map((s, j) => {
        if (typeof s === "string") {
          s = s.replace(/\s+/g, "");
          s = s.replace(/"/g, "");

          k.splice(j, 1, s);
        }
        return null;
      });
      js.splice(i, 1, k);
      return null;
    });
    const rtn = arrayToJson(js);
    setInitVal(inputdt);
    setResult(JSON.stringify(rtn, null, 2));
    chkArrayNupdate(rtn);
    setLoading(false);
  };
  const arrayToJson = (data) => {
    const head = data.shift();
    let rtn = [];
    data.map((k, i) => {
      let obj = {};
      head.map((s, j) => {
        obj[s] = k[j];
        return null;
      });
      rtn.push(obj);
    });
    return rtn;
  };
  const chkArrayNupdate = (inputval) => {
    if (Array.isArray(inputval)) {
      setShowalert(false);
      onDataUpdate(authObj, inputval, { dtype: "paste" });
    } else setShowalert(true);
  };

  const userInput = (inputval) => {
    setResult(JSON.stringify(inputval, null, 2));
    chkArrayNupdate(inputval);
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
    "json",
  ]
    .map(function (x) {
      return "." + x;
    })
    .join(",");

  return (
    <>
      <Row gutter={4}>
        <Col flex={6}>
          <TextArea
            rows={10}
            onFocus={() => setLoading(true)}
            onBlur={() => setLoading(false)}
            onChange={onChange}
            accept={SheetJSFT}
            value={initVal}
          />
        </Col>
        <Col flex={6}>
          {result && <TextArea rows={10} id="code" value={result}></TextArea>}
          <div style={{ marginTop: 5 }}>
            {(() => {
              switch (showalert) {
                case true:
                  return (
                    <Alert
                      message="Not array!, Select an array datafield"
                      type="error"
                    />
                  );
                case false:
                  return <Alert message="Good Json format!" type="success" />;
                default:
                  return null;
              }
            })()}

            {/* {showalert ? (
              <Alert
                message="Not array!, Select an array datafield"
                type="error"
              />
            ) : (
              <Alert message="Good Json format!" type="success" />
            )} */}
          </div>
        </Col>
      </Row>
      <Spin spinning={loading} />
    </>
  );
};

export default DataPaste;
