import React, { FC, useEffect, RefObject } from 'react';
import { Input, Form, Select } from 'antd';
import { ValidationRule } from 'antd/lib/form';

const Item = Form.Item;
const Option = Select.Option;

export type CellType = {
  dataIndex: string;
  rowIndex: number;
} | null;

export interface CellProps {
  form: any;
  dataIndex: string;
  rowIndex: number;
  curCell: CellType;
  onSetCurCell: (curCell: CellType) => void;
  initialValue: any;
  rules: ValidationRule[];
  isSelect: boolean | Array<{ label: string; value: any }>;
}

const Cell: FC<CellProps> = ({
  form,
  dataIndex,
  rowIndex,
  curCell,
  onSetCurCell,
  initialValue,
  rules = [],
  isSelect,
}) => {
  // 是否处于可编辑状态
  const isEditing: boolean =
    !!curCell && curCell.dataIndex === dataIndex && curCell.rowIndex === rowIndex;

  // input的Ref，用于激活后的focus
  const inputRef = useFocus(isEditing);

  // 将当前的Cell激活
  function handleSetCurCell() {
    if (curCell) {
      form.validateFields([`${curCell.dataIndex}-${curCell.rowIndex}`], (err: object) => {
        if (!err) onSetCurCell({ dataIndex, rowIndex });
      });
    } else {
      onSetCurCell({ dataIndex, rowIndex });
    }
  }

  // 保存值到表单域里
  function handleSave() {
    form.validateFields([`${dataIndex}-${rowIndex}`], (err: object) => {
      if (!err) {
        onSetCurCell(null);
      }
    });
  }

  // 静态值
  const stockCell = (
    <div onClick={handleSetCurCell} className="editable-cell-value-wrap">
      {Array.isArray(isSelect)
        ? (function foo() {
            const target = isSelect.find(({ value }) => value === initialValue);
            return target ? target.label : initialValue;
          })()
        : initialValue}
    </div>
  );

  // 获取控件
  const getFormItem = () => {
    if (isSelect) {
      return (
        <Select onChange={handleSave} ref={inputRef} onBlur={handleSave} style={{ width: '100%' }}>
          {Array.isArray(isSelect) &&
            isSelect.map((item, index) => (
              <Option key={index} value={item.value}>
                {item.label}
              </Option>
            ))}
        </Select>
      );
    } else {
      return <Input ref={inputRef} onPressEnter={handleSave} onBlur={handleSave} />;
    }
  };

  const rulesWithCellInfo = rules.map(item => {
    const { validator } = item;
    return validator
      ? {
          ...item,
          validator: (rule: any, value: any, callback: any) => {
            validator(rule, value, callback, curCell);
          },
        }
      : item;
  });

  return (
    <div style={{ textAlign: 'left' }}>
      <Item>
        {form.getFieldDecorator(`${dataIndex}-${rowIndex}`, {
          initialValue: initialValue === '--' ? '' : initialValue,
          rules: rulesWithCellInfo,
        })(isEditing ? getFormItem() : stockCell)}
      </Item>
    </div>
  );
};

const useFocus = (isEditing: boolean) => {
  const inputRef: RefObject<any> = React.createRef();

  useEffect(() => {
    if (isEditing) {
      if (inputRef.current) inputRef.current.focus();
    }
  }, [isEditing]);

  return inputRef;
};

export default Cell;
