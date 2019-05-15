import React, { FC } from 'react';
import { Table, Form, Button } from 'antd';
import { TableProps, ColumnProps } from 'antd/lib/table';
import { ValidationRule, FormComponentProps } from 'antd/lib/form';
import { ButtonProps } from 'antd/lib/button';

import useProps from './useProps';
import EditableWrapper from './style/EditableWrapper';

export interface EditableColumn<T> extends ColumnProps<T> {
  /** 列的是否可编辑 */
  editable?: boolean;
  /** 列数据的校验规则 ref: https://ant.design/components/form-cn/#%E6%A0%A1%E9%AA%8C%E8%A7%84%E5%88%99 */
  rule?: ValidationRule[];
}

export interface EditableProps<T> extends TableProps<T> {
  /** 表格列的配置描述， 用过 antd Table 的都懂 */
  columns?: Array<EditableColumn<T>>;
  /** 单元格更新回调 */
  onCellChange?: (nextSource: T[]) => void;
  /** 保存按钮回调，如传入此属性，则会在表格下方多出一个button */
  onSubmit?: (nextSource: T[]) => void;
  /** 保存按钮的props, 与onSubmit联用, 可用 text 属性设置按钮文字 */
  btnProps: { text?: string } & ButtonProps;
}

type WrappProps = FormComponentProps & EditableProps<any>;

function noop() {}

const btnDefaultProps = { text: '保存', style: { marginTop: 10 } };

const Editable: FC<WrappProps> = ({
  dataSource = [],
  columns = [],
  form,
  btnProps = btnDefaultProps,
  onCellChange = noop,
  onSubmit = noop,
  ...resProps
}) => {
  const { cacheSource, editColumns } = useProps(dataSource, columns, onCellChange, form);

  const { text: btnText, ...restBtnProps } = btnProps;

  function handleSubmit() {
    onSubmit(cacheSource);
  }

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
      {onSubmit && (
        <Button onClick={handleSubmit} {...restBtnProps}>
          {btnText}
        </Button>
      )}
    </EditableWrapper>
  );
};

export default Form.create()(Editable);
