import React from "react";
import Cell from "./Cell";
// 给空数据一个占位符
function hasData(data) {
  if (data != null && data !== "") {
    return data;
  } else {
    return "--";
  }
}
export default (columns, curCell, setCurCell, form) => {
  const dataIndexMap = [];
  const loopColumns = columns => {
    return columns.map(item => {
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
          validator,
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
          render: (text, record, rowIndex) => {
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
                initialValue
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
