import { useEffect } from 'react';

import { CellType } from './Cell';

const useTabChange = (
  curCell: CellType,
  setCurCell: any,
  cacheSource: any[],
  dataIndexMap: string[][],
) => {
  useEffect(() => {
    // 计算下一行的index
    function getNextRowIndex(preRowIndex: number, dataSource: any[]): number {
      const length = dataIndexMap.length;
      let i = preRowIndex + 1;
      while (dataSource[i] && dataSource[i].editable === false) {
        i++;
      }
      return length > i ? i : preRowIndex;
    }

    // 被 window 监听的键盘事件
    function handleTabChange(e: KeyboardEvent) {
      // 只在按 tab 键并且当前有被激活的单元格才执行
      if (e.keyCode === 9 && curCell !== null) {
        e.preventDefault();
        const { rowIndex, dataIndex } = curCell!;
        const dataIndexMapItem = dataIndexMap[rowIndex];
        const index: number = dataIndexMapItem.indexOf(dataIndex);

        // 是否需要换行
        const changeRow: boolean = index === dataIndexMapItem.length - 1;
        const nextRow: number = getNextRowIndex(rowIndex, cacheSource);
        const canChangeRow: boolean =
          cacheSource.length - 1 >= rowIndex + 1 && nextRow !== rowIndex;

        let nextCell: CellType;

        // 判断切换条件
        if (changeRow && !canChangeRow) {
          nextCell = null;
        } else {
          nextCell = {
            rowIndex: changeRow ? nextRow : rowIndex,
            dataIndex: changeRow ? dataIndexMap[nextRow][0] : dataIndexMapItem[index + 1],
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
