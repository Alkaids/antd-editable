import React, { useEffect, RefObject } from 'react';
import { Input, Form } from 'antd';
import { CellType } from './Editable';
import { ValidationRule } from 'antd/lib/form';
const Item = Form.Item;

interface CellProps {
  form: any;
  dataIndex: string;
  rowIndex: number | boolean;
  curCell: CellType;
  onSetCurCell: (curCell: CellType) => void;
  initialValue: any;
  rules: ValidationRule[];
}

function Cell(props: CellProps) {
  const {
    form,
    dataIndex,
    rowIndex,
    curCell,
    onSetCurCell,
    initialValue,
    rules = []
  } = props;

  const isEditing =
    curCell && curCell.dataIndex === dataIndex && curCell.rowIndex === rowIndex;

  const inputRef: RefObject<Input> = React.createRef();

  useEffect(() => {
    if (isEditing) {
      inputRef.current && inputRef.current.focus();
    }
  });

  function handleSetCurCell() {
    onSetCurCell({
      dataIndex,
      rowIndex
    });
  }
  function handleSave() {
    form.validateFields([`${dataIndex}-${rowIndex}`], (err: object) => {
      if (!err) {
        onSetCurCell(null);
      }
    });
  }
  const stockCell = (
    <div onClick={handleSetCurCell} className="editable-cell-value-wrap">
      {initialValue}
    </div>
  );

  return (
    <div style={{ textAlign: 'left' }}>
      <Item>
        {form.getFieldDecorator(`${dataIndex}-${rowIndex}`, {
          initialValue: initialValue === '--' ? '' : initialValue,
          rules
        })(
          isEditing ? (
            <Input
              ref={inputRef}
              onPressEnter={handleSave}
              onBlur={handleSave}
            />
          ) : (
            stockCell
          )
        )}
      </Item>
    </div>
  );
}

export default Cell;
