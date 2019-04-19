import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Table, Form } from 'antd';
import produce from 'immer';
import computedEditColumns from './computedEditColumns';
import EditableWrapper from './style/EditableWrapper';
import { TableProps, ColumnProps } from 'antd/lib/table';
import { ValidationRule, FormComponentProps } from 'antd/lib/form';

export interface EditableColumn<T> extends ColumnProps<T> {
  editable?: boolean;
  rule?: ValidationRule[];
}

export interface EditableProps<T> extends TableProps<T> {
  columns?: EditableColumn<T>[];
  onCellChange?: (nextSource:T[]) => void;
}

interface CellInterFace {
  dataIndex: string;
  rowIndex: number|boolean;
}

export type CellType = CellInterFace | null

type WrappProps = FormComponentProps & EditableProps<any>;

function noop() {}

const Editable = Form.create()(
  ({
    dataSource = [],
    columns = [],
    onCellChange = noop,
    form,
    ...resProps
  }: WrappProps) => {
    const [curCell, setCurCell] = useState(null);
    const [cacheSource, setCacheSource] = useState(dataSource);
    const beforeCell = useRef(null);
    const { editColumns, dataIndexMap } = useMemo(
      () => computedEditColumns(columns, curCell, setCurCell, form),
      [columns, curCell]
    );

    useEffect(() => {
      if (beforeCell.current) {
        const { dataIndex, rowIndex } = beforeCell.current || {dataIndex:'',rowIndex:0};
        const value = form.getFieldValue(`${dataIndex}-${rowIndex}`);
        const nextSource = produce(cacheSource, draft => {
          draft[rowIndex][dataIndex] = value;
        });
        setCacheSource(nextSource);
        onCellChange(nextSource);
      }
      beforeCell.current = curCell;
    }, [curCell]);

    // tab 切换
    useEffect(() => {
      function getNextRowIndex(preRowIndex:number):number|boolean {
        let length = cacheSource.length;
        let i = preRowIndex + 1;
        for (; i < length; i++) {
          if (cacheSource[i].editable !== false) {
            return i;
          }
        }
        return false;
      }
      function handleTabChange(e:KeyboardEvent) {
        if (e.keyCode === 9 && curCell !== null) {
          e.preventDefault();
          const { rowIndex, dataIndex } = curCell|| {dataIndex:'',rowIndex:0};
          const index = dataIndexMap.indexOf(dataIndex);
          const changeRow = index === dataIndexMap.length - 1;
          const nextRow = getNextRowIndex(rowIndex);
          const canChangeRow =
            cacheSource.length - 1 >= rowIndex + 1 && !!nextRow;

          let nextCell:any;
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
);

export default Editable;
