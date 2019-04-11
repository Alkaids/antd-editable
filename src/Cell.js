import React, { useEffect } from 'react';
import { Input, Form } from 'antd';

const Item = Form.Item;

function Cell(props) {
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

  const inputRef = React.createRef();

  useEffect(() => {
    if (isEditing) {
      inputRef.current.focus();
    }
  });

  function handleSetCurCell() {
    onSetCurCell({
      dataIndex,
      rowIndex
    });
  }
  function handleSave() {
    onSetCurCell(null);
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
