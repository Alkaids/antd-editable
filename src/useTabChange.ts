import { useEffect } from 'react';

import { CellType } from './Cell';

const useTabChange = (
  curCell: CellType,
  setCurCell: any,
  cacheSource: any[],
  dataIndexMap: string[],
) => {
  useEffect(() => {
    // 计算下一行的index
    function getNextRowIndex(preRowIndex: number): number {
      const length = cacheSource.length;
      let i = preRowIndex + 1;
      for (; i < length; i += 1) {
        if (cacheSource[i].editable !== false) {
          return i;
        }
      }
      return preRowIndex;
    }

    // 被 window 监听的键盘事件
    function handleTabChange(e: KeyboardEvent) {
      // 只在按 tab 键并且当前有被激活的单元格才执行
      if (e.keyCode === 9 && curCell !== null) {
        e.preventDefault();
        const { rowIndex, dataIndex } = curCell!;
        const index: number = dataIndexMap.indexOf(dataIndex);

        // 是否需要换行
        const changeRow: boolean = index === dataIndexMap.length - 1;
        const nextRow: number = getNextRowIndex(rowIndex);
        const canChangeRow: boolean =
          cacheSource.length - 1 >= rowIndex + 1 && nextRow !== rowIndex;

        let nextCell: CellType;
        // 判断切换条件
        if (changeRow && !canChangeRow) {
          nextCell = null;
        } else {
          nextCell = {
            rowIndex: changeRow ? nextRow : rowIndex,
            dataIndex: changeRow ? dataIndexMap[0] : dataIndexMap[index + 1],
          };
        }
        setCurCell(nextCell);
      }
    }

    // 绑定
    window.addEventListener('keydown', handleTabChange);

    // 解除
    return () => {
      window.removeEventListener('keydown', handleTabChange);
    };
  });
};

export default useTabChange;
