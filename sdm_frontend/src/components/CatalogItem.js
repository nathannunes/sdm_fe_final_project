import React, { useState } from "react";
import Accordion from "react-bootstrap/Accordion";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";

import "./Button.css";
import useToken from "./useToken";

const CatalogItem = (props) => {
  const { token } = useToken();
  return (
    <Accordion.Item eventKey={props.concentration}>
      <Accordion.Header>{props.concentration}</Accordion.Header>
      <Accordion.Body>
        <Table striped borderless>
          <tbody>
            {props.subjects.map((item) => {
              return (
                <tr key={item.code}>
                  <td>
                    <strong>{item.code}</strong>
                  </td>
                  <td>{item.name}</td>
                  <td>
                    {props.isAAdm && (
                      <Button
                        bsPrefix="btn-custom"
                        className="logout"
                        onClick={() => {
                          props.showModifyOverlay(item, props.concentration);
                        }}
                      >
                        Modify
                      </Button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Accordion.Body>
    </Accordion.Item>
  );
};

export default CatalogItem;
