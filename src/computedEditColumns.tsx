import * as React from 'react';

import { EditableColumn } from './Editable';
import Cell, { CellType } from './Cell';
import { hasData } from './_utils';

export default <T extends object>(
  columns: Array<EditableColumn<T>>,
  curCell: CellType,
  setCurCell: any,
  form: any,
) => {
  const dataIndexMap: string[][] = [];
  const loopColumns = (lColumns: Array<EditableColumn<T>>): Array<EditableColumn<T>> => {
    let dataIndexMapItem: string[] = [];
    return lColumns.map((item: any) => {
      if (item.children) {
        const { children, ...resCol } = item;
        return {
          ...resCol,
          children: loopColumns(children),
        };
      } else {
        const { render, dataIndex, editable = true, rules, isSelect, children, ...res } = item;
        const resItem = {
          dataIndex,
          ...res,
          render: (text: string, record: any, rowIndex: number) => {
            // 注意 editable 字段来自dataSource（通常由后端控制），用于控制行是否可编辑
            const { editable: rowEditbale = true } = record;
            const initialValue = hasData(render ? render(text, record, rowIndex) : text);
            const canRowEditbale: boolean =
              typeof rowEditbale === 'boolean'
                ? rowEditbale
                : (function foo() {
                    const { disabled = [] } = rowEditbale;
                    return !disabled.includes(dataIndex);
                  })();
            if (editable && canRowEditbale) {
              // magic code
              dataIndexMapItem.includes(dataIndex)
                ? (dataIndexMapItem = [dataIndex])
                : dataIndexMapItem.push(dataIndex);
              dataIndexMap[rowIndex] = dataIndexMapItem;
              const cellprops = {
                form,
                key: `${dataIndex}-${rowIndex}`,
                dataIndex,
                rowIndex,
                curCell,
                onSetCurCell: setCurCell,
                initialValue,
                rules,
                isSelect,
              };
              return <Cell {...cellprops} />;
            }
            return <div className="editable-cell-uneditable">{initialValue}</div>;
          },
        };
        return resItem;
      }
    });
  };
  return {
    editColumns: loopColumns(columns),
    dataIndexMap,
  };
};
