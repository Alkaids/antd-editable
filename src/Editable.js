import React, { useState, useEffect, useMemo, useRef } from "react";
import { Table, Form } from "antd";
import produce from "immer";
import computedEditColumns from "./computedEditColumns";

function Editable({
  dataSource = [],
  columns = [],
  onChange,
  form,
  ...resProps
} = {}) {
  const [curCell, setCurCell] = useState(null);
  const [cacheSource, setCacheSource] = useState(dataSource);
  const beforeCell = useRef(null);
  const editColumns = useMemo(
    () => computedEditColumns(columns, curCell, setCurCell, form),
    [columns, curCell]
  );
  useEffect(() => {
    if (beforeCell.current) {
      const { dataIndex, rowIndex } = beforeCell.current;
      const value = form.getFieldValue(`${dataIndex}-${rowIndex}`);
      setCacheSource(
        produce(cacheSource, draft => {
          draft[rowIndex][dataIndex] = value;
        })
      );
    }
    beforeCell.current = curCell;
  }, [curCell]);
  return (
    <Table
      className="editable"
      dataSource={cacheSource}
      columns={editColumns}
      rowClassName={() => "editable-row"}
      {...resProps}
      pagination={false}
    />
  );
}

export default Form.create()(Editable);
