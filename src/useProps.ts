import { useState, useEffect, useMemo, useRef } from 'react';
import produce from 'immer';

import useTabChange from './useTabChange';
import computedEditColumns from './computedEditColumns';
import { CellType } from './Cell';
import { EditableColumn } from './Editable';

const useProps = <T extends object>(
  dataSource: T[],
  columns: Array<EditableColumn<T>>,
  onCellChange: (nextSource: T[]) => void,
  form: any,
) => {
  // 当前被激活的单元格，默认为null
  const [curCell, setCurCell] = useState<CellType>(null);

  // 内部维护的 dataSource
  const { cacheSource, setCacheSource } = useDataSource(dataSource, form);

  // 用 ref 记录每次被更新的单元格
  const beforeCell = useRef<CellType>(null);

  // 使用 useMemo 缓存 editColumns 和 dataIndexMap。 只在 columns 和 curCell 更改后更新
  const { editColumns, dataIndexMap } = useMemo(
    () => computedEditColumns(columns, curCell, handleSetCurCell, form),
    [columns, curCell],
  );

  // tab键切换
  useTabChange(curCell, handleSetCurCell, cacheSource, dataIndexMap);

  // 每当 curCell 更变后，更改缓存的 dataSource 。 并且执行 onCellChange
  useEffect(() => {
    if (beforeCell && beforeCell.current) {
      const { dataIndex, rowIndex } = beforeCell.current;
      const value = form.getFieldValue(`${dataIndex}-${rowIndex}`);
      const nextSource = produce(cacheSource, draft => {
        draft[rowIndex][dataIndex] = value;
      });
      setCacheSource(nextSource);
      onCellChange(nextSource);
    }
    // 重新设置 Ref 记录的值
    beforeCell.current = curCell;
  }, [curCell]);

  function handleSetCurCell(nextCell: CellType) {
    //  当前单元格有错误的话则禁止切换
    if (!curCell || !form.getFieldError(`${curCell!.dataIndex}-${curCell!.rowIndex}`)) {
      setCurCell(nextCell);
    }
  }

  return {
    cacheSource,
    editColumns,
  };
};

const useDataSource = (dataSource: any[], form: any) => {
  const [cacheSource, setCacheSource] = useState(dataSource);

  // 外部 dataSource 更新了同步更新缓存的 dataSource 和 表单域的值
  useEffect(() => {
    setCacheSource(dataSource);
    form.resetFields();
  }, [dataSource]);

  return {
    cacheSource,
    setCacheSource,
  };
};

export default useProps;
