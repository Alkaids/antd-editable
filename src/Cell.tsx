import React, { useEffect, RefObject, FC } from 'react';
import { Input, Form } from 'antd';
import { ValidationRule } from 'antd/lib/form';
const Item = Form.Item;

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
}

const Cell: FC<CellProps> = ({
    form,
    dataIndex,
    rowIndex,
    curCell,
    onSetCurCell,
    initialValue,
    rules = []
}) => {
    // 是否处于可编辑状态
    const isEditing: boolean =
        !!curCell && curCell.dataIndex === dataIndex && curCell.rowIndex === rowIndex;

    // input的Ref，用于激活后的focus
    const inputRef = useFocus(isEditing);

    // 将当前的Cell激活
    function handleSetCurCell() {
        onSetCurCell({
            dataIndex,
            rowIndex
        });
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
                        <Input ref={inputRef} onPressEnter={handleSave} onBlur={handleSave} />
                    ) : (
                        stockCell
                    )
                )}
            </Item>
        </div>
    );
};

const useFocus = isEditing => {
    const inputRef: RefObject<Input> = React.createRef();

    useEffect(() => {
        if (isEditing) {
            inputRef.current && inputRef.current.focus();
        }
    }, [isEditing]);

    return inputRef;
};

export default Cell;
