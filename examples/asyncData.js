import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import Editable from '../src/index';

const warraperStyle = {
    width: 600,
    margin: '50px auto'
};

const mockDataSource = [
    {
        key: '1',
        name: '金鑫',
        age: 16,
        address: '慕和兰道304'
    },
    {
        key: '2',
        name: '张海新',
        age: 17,
        address: '慕和兰道304',
        editable: false
    },
    {
        key: '3',
        name: '李鳌',
        age: 15,
        address: '慕和兰道304'
    }
];

const columns = [
    {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
        width: '30%',
        rules: [
            {
                required: true,
                message: '请填写姓名'
            }
        ]
    },
    {
        title: '年龄',
        dataIndex: 'age',
        key: 'age',
        width: '30%',
        rules: [
            {
                pattern: /^\d{1,3}$/,
                message: '请输入正确的年龄'
            }
        ]
    },
    {
        title: '住址',
        dataIndex: 'address',
        key: 'address',
        editable: false
    }
];

function App() {
    const [dataSource, setDataSource] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setDataSource(mockDataSource);
            setLoading(false);
        }, 3000);
    }, []);

    function handleCellChange(nextSource){
        setDataSource(nextSource);
    }

    return (
        <div style={warraperStyle}>
            <h3>异步数据加载(延迟3s)</h3>
            <Editable
                bordered
                dataSource={dataSource}
                columns={columns}
                loading={loading}
                onCellChange={handleCellChange}
            />
        </div>
    );
}

ReactDOM.render(<App />, document.getElementById('__react-content'));
