import React, { useEffect, useState } from "react";
import _ from "lodash";
import Dataget from "Data/Dataget";
import DataPaste from "Data/DataPaste";
import SheetJSApp from "Data/Excel/Sheetjs";
import { Select, Row, Col, Typography, Button, Divider, Tooltip } from "antd";
import { BiReset } from "react-icons/bi";
import SingleTable, { UpdateColnData } from "Data/SingleTable";

const { Option } = Select;
const { Title } = Typography;

const Index = ({ authObj, onChange }) => {
  const [dtype, setDtype] = useState();
  const [newObj, setNewObj] = useState();

  useEffect(() => {
    if (authObj && authObj.dtsetting) setDtype(authObj.dtsetting.dtype);
    setNewObj(authObj);
  }, []);
  function handleChange(value) {
    setDtype(value);
  }
  const onDataUpdate = (authObj, dtlist, dtsetting) => {
    if (!authObj) authObj = {};
    authObj.dtlist = dtlist;
    authObj.originlist = dtlist;
    authObj.dtsetting = dtsetting;
    localStorage.setItem("modelchart", JSON.stringify(authObj));
    setNewObj(_.cloneDeep(authObj));
    if (onChange) onChange(authObj);
  };
  const saveSingleTable = (newdata, activeKey) => {
    //change dtlist
    const rtn = UpdateColnData(newdata);
    newdata.dtlist = rtn.dtlist;
    localStorage.setItem("modelchart", JSON.stringify(newdata));
    if (onChange) onChange(newdata);
  };
  return (
    <div style={{ padding: "5px 5px 10px 10px" }}>
      <Row gutter={4}>
        <Col flex={11}>
          <Title level={4}>Data</Title>
        </Col>
        <Col flex={"auto"}>
          <div style={{ float: "right" }}>
            <Tooltip title="Reset data">
              <Button
                type="primary"
                size="small"
                icon={<BiReset />}
                onClick={() => setDtype(null)}
              />
            </Tooltip>
          </div>
        </Col>
      </Row>

      <Divider style={{ marginTop: 0 }} />
      {(() => {
        switch (dtype) {
          case "api":
            return (
              <div>
                <Dataget authObj={authObj} onDataUpdate={onDataUpdate} />
              </div>
            );
          case "excel":
            return (
              <>
                <SheetJSApp authObj={authObj} onDataUpdate={onDataUpdate} />
              </>
            );
          case "paste":
            return (
              <>
                <DataPaste authObj={authObj} onDataUpdate={onDataUpdate} />
              </>
            );
          default:
            return (
              <div>
                <label
                  for="dtype"
                  style={{ width: 150, marginRight: 10, marginLeft: 20 }}
                >
                  Data type:
                </label>
                <Select
                  name="dtype"
                  defaultValue={dtype}
                  onChange={handleChange}
                  style={{ width: 200 }}
                  placeholder="Select data type"
                >
                  <Option value=""></Option>
                  <Option value="api">API</Option>
                  <Option value="excel">Excel</Option>
                  <Option value="paste">Direct Paste</Option>
                </Select>
              </div>
            );
        }
      })()}
      <div style={{ padding: 10 }}>
        <SingleTable
          dataObj={newObj}
          // tbsetting={tbsetting}
          edit={true}
          className="gridcontent"
          save={saveSingleTable}
        />
      </div>
    </div>
  );
};

export default Index;
export { SingleTable, UpdateColnData };
