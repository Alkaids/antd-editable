import styled from 'styled-components';

export const EditableWrapper = styled.div`
  .metro-editable {
    table {
      table-layout: fixed;

      .ant-table-thead > tr > th {
        white-space: nowrap;
      }

      .ant-table-tbody > tr > td {
        overflow: hidden;
        text-overflow: unset;
        word-break: break-all;
        .ant-form-item {
          margin-bottom: 0;
          .ant-form-item-control {
            line-height: 24px;
          }
        }
      }

      .metro-editable-row {
        .editable-cell-uneditable {
          padding: 5px 12px;
        }
        .editable-cell-value-wrap {
          padding: 5px 12px;
          cursor: pointer;
        }
        &:hover {
          .editable-cell-value-wrap {
            border: 1px solid #d9d9d9;
            border-radius: 4px;
            padding: 4px 11px;
            cursor: pointer;
          }
        }
      }
    }
  }
`;

export default EditableWrapper;
