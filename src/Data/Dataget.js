import React, { useEffect, useState } from "react";
import axios from "axios";
import AntFormDisplay from "imcformbuilder";
import formdt from "./AntFormDisplay.json";
import { Input, Row, Col, Alert, Spin, message } from "antd";
import styled, { css } from "styled-components";

const { TextArea } = Input;

const Dataget = ({ authObj, onDataUpdate, ...props }) => {
  const [initVal, setInitVal] = useState();
  const [result, setResult] = useState();
  const [showalert, setShowalert] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setShowalert(false);
    setLoading(false);

    if (authObj && authObj.dtsetting) {
      setInitVal(authObj.dtsetting);

      if (authObj.dtlist) setResult(JSON.stringify(authObj.dtlist, null, 2));
    } else {
      setInitVal({
        url: "",
        method: "get",
        body: "",
        header: "",
        datafield: "",
      });
      setResult(" ");
    }
  }, []);

  const onFinish = (val) => {
    let options = {
      method: val.method,
      url: val.url,
    };
    if (val.header) options = { ...options, header: val.header };
    if (val.body) options = { ...options, data: JSON.parse(val.body) };
    if (val.parameters) {
      const newurl = `${val.url}?${val.parameters}`;
      options = { ...options, url: newurl };
    }
    console.log(options);
    setLoading(true);
    val.dtype = "api";
    axios
      .request(options)
      .then(function (response) {
        let rtn = response.data;
        //$("#dvResult").css({ visibility: "visible" });
        if (val.datafield) {
          const fields = val.datafield.split(".");

          fields.map((k, i) => {
            rtn = rtn[k];
            return null;
          });
        }

        setResult(JSON.stringify(rtn, null, 2));

        if (Array.isArray(rtn)) {
          val.dtype = "api";
          onDataUpdate(authObj, rtn, val);
          setShowalert(false);
        } else setShowalert(true);
        setLoading(false);
        setInitVal(val);
      })
      .catch(function (error) {
        console.error(error);
        setLoading(false);
        setInitVal(val);
      });
  };

  return (
    <>
      <Row gutter={4}>
        <Col flex={6}>
          {initVal && (
            <AntFormDisplay
              formArray={formdt["60fe76d93f6f282f238e01bb"]}
              onFinish={onFinish}
              initialValues={initVal}
            />
          )}
        </Col>
        <Col flex={6}>
          {result && <TextArea rows={10} id="code" value={result}></TextArea>}
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
      <DarkBackground disappear={loading}>
        <div style={{ position: "absolute", top: 200, left: "50%" }}>
          <Spin spinning={loading} />
        </div>
      </DarkBackground>
    </>
  );
};
export const DarkBackground = styled.div`
  display: none; /* Hidden by default */
  position: fixed; /* Stay in place */
  z-index: 999; /* Sit on top */
  left: 0;
  top: 0;
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  overflow: auto; /* Enable scroll if needed */
  background-color: rgb(0, 0, 0); /* Fallback color */
  background-color: rgba(0, 0, 0, 0.4); /* Black w/ opacity */

  ${(props) =>
    props.disappear &&
    css`
      display: block; /* show */
    `}
`;
export default Dataget;
