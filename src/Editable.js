import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Table, Form } from 'antd';
import produce from 'immer';
import computedEditColumns from './computedEditColumns';
import EditableWrapper from './style/EditableWrapper';

function noop() {}

function Editable({
  dataSource = [],
  columns = [],
  onChange = noop,
  form,
  ...resProps
} = {}) {
  const [curCell, setCurCell] = useState(null);
  const [cacheSource, setCacheSource] = useState(dataSource);
  const beforeCell = useRef(null);
  const { editColumns, dataIndexMap } = useMemo(
    () => computedEditColumns(columns, curCell, setCurCell, form),
    [columns, curCell]
  );

  useEffect(() => {
    if (beforeCell.current) {
      const { dataIndex, rowIndex } = beforeCell.current;
      const value = form.getFieldValue(`${dataIndex}-${rowIndex}`);
      const nextSource = produce(cacheSource, draft => {
        draft[rowIndex][dataIndex] = value;
      });
      setCacheSource(nextSource);
      onChange(nextSource);
    }
    beforeCell.current = curCell;
  }, [curCell]);

  // tab 切换
  useEffect(() => {
    function getNextRowIndex(preRowIndex) {
      let length = cacheSource.length;
      let i = preRowIndex + 1;
      for (; i < length; i++) {
        if (cacheSource[i].editable !== false) {
          return i;
        }
      }
      return false;
    }
    function handleTabChange(e) {
      if (e.keyCode === 9 && curCell !== null) {
        e.preventDefault();
        const { rowIndex, dataIndex } = curCell;
        const index = dataIndexMap.indexOf(dataIndex);
        const changeRow = index === dataIndexMap.length - 1;
        const nextRow = getNextRowIndex(rowIndex);
        const canChangeRow =
          cacheSource.length - 1 >= rowIndex + 1 && !!nextRow;

        let nextCell;
        if (changeRow && !canChangeRow) {
          nextCell = null;
        } else {
          nextCell = {
            rowIndex: changeRow ? nextRow : rowIndex,
            dataIndex: changeRow ? dataIndexMap[0] : dataIndexMap[index + 1]
          };
        }
        setCurCell(nextCell);
      }
    }
    window.addEventListener('keydown', handleTabChange);
    return () => {
      window.removeEventListener('keydown', handleTabChange);
    };
  });

  return (
    <EditableWrapper>
      <Table
        className="editable"
        dataSource={cacheSource}
        columns={editColumns}
        rowClassName={() => 'editable-row'}
        {...resProps}
        pagination={false}
      />
    </EditableWrapper>
  );
}

export default Form.create()(Editable);
