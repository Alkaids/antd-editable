import styled from 'styled-components';

export const EditableWrapper = styled.div`
  .ant-form-item {
    margin-bottom: 0;
  }
  .ant-form-item-control {
    line-height: 24px;
  }
  .editable-cell-uneditable {
    padding: 5px 12px;
  }
  .editable-cell-value-wrap {
    padding: 5px 12px;
    cursor: pointer;
  }
  .editable-row:hover {
    .editable-cell-value-wrap {
      border: 1px solid #d9d9d9;
      border-radius: 4px;
      padding: 4px 11px;
    }
  }
`;

export default EditableWrapper;
