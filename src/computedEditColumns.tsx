import * as React from 'react';
import Cell from './Cell';
import { EditableColumn, CellType } from './Editable';
// 给空数据一个占位符
function hasData<T>(data: T): T | string {
  if (data != null || data !== '') {
    return data;
  } else {
    return '--';
  }
}
export default <T extends object>(
  columns: EditableColumn<T>[],
  curCell: CellType,
  setCurCell: any,
  form: any
) => {
  const dataIndexMap: Array<string> = [];
  const loopColumns = (columns: EditableColumn<T>[]): T[] => {
    return columns.map((item: any) => {
      if (item.children) {
        const { children, ...resCol } = item;
        return {
          ...resCol,
          children: loopColumns(children)
        };
      } else {
        const {
          render,
          dataIndex,
          editable = true,
          rules,
          children,
          ...res
        } = item;
        if (editable) {
          dataIndexMap.push(dataIndex);
        }
        const resItem = {
          dataIndex,
          ...res,
          render: (text: string, record: any, rowIndex: number) => {
            // 注意valid字段来自dataSource（通常由后端控制），用于控制行是否可编辑
            const { editable: rowEditbale = true } = record;
            const initialValue = hasData(
              render ? render(text, record, rowIndex) : text
            );
            if (rowEditbale && editable) {
              const cellprops = {
                form,
                key: `${dataIndex}-${rowIndex}`,
                dataIndex,
                rowIndex,
                curCell,
                onSetCurCell: setCurCell,
                initialValue,
                rules
              };
              return <Cell {...cellprops} />;
            } else {
              return (
                <div className="editable-cell-uneditable">{initialValue}</div>
              );
            }
          }
        };
        return resItem;
      }
    });
  };
  return {
    editColumns: loopColumns(columns),
    dataIndexMap
  };
};
