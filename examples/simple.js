import React from 'react';
import ReactDOM from 'react-dom';
import Editable from '../src';

const warraperStyle = {
  width: 600,
  margin: '50px auto',
};

const dataSource = [
  {
    key: '1',
    name: '金鑫',
    age: 16,
    address: '慕和兰道304',
  },
  {
    key: '2',
    name: '张海新',
    age: 17,
    address: '慕和兰道304',
    editable: false,
  },
  {
    key: '3',
    name: '李鳌',
    age: 15,
    address: '慕和兰道304',
  },
];

const columns = [
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
    width: '30%',
  },
  {
    title: '年龄',
    dataIndex: 'age',
    key: 'age',
    width: '30%',
  },
  {
    title: '住址',
    dataIndex: 'address',
    key: 'address',
    editable: false,
  },
];

function handleTableChange(nextSource) {
  console.log(nextSource);
}

function App() {
  return (
    <div style={warraperStyle}>
      <h3>antd-editable</h3>
      <Editable
        dataSource={dataSource}
        columns={columns}
        bordered
        onCellChange={handleTableChange}
      />
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('__react-content'));
