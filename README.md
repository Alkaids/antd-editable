# 可编辑表格(React hooks)

一个基于 [antd](https://ant.design/index-cn) 的 React 组件， 可以编辑表格的内容并实时保存。

[![NPM version](https://img.shields.io/npm/v/antd-editable.svg?style=flat)](https://npmjs.org/package/antd-editable)
[![NPM downloads](https://img.shields.io/npm/dm/antd-editable.svg?style=flat)](https://npmjs.org/package/antd-editable)

## Features

-   [x] 行/列可编辑
-   [x] tab 键切换
-   [x] 自定义表单数据校验
-   [x] typescript 支持
-   [x] 支持 Select 控件
-   [x] 行/列/单元格禁用

## 何时使用

当表格涉及到内容的修改的时候

## 如何使用

### 安装

```
    $ yarn add antd-editable
```

### 使用

默认已经开启所有的单元格可编辑。如需禁用某列的可编辑，只需要在传入 columns 里设置对应列的 editable 为 false。 如需禁用某行的可编辑，只需要在传入 dataSource 里设置对应行的 editable 为 false。

每一次输入框失焦后，会在组件内部保存一个新的 dataSource ，可以传入一个 onCellChange 的回调函数用于捕获这个实时的 dataSource 用于一些类似 dispatch 的操作。

### 示例代码

```js
    import Editable from 'antd-editable';
    ...

   const dataSource = [
        {
            key: "1",
            name: "金鑫",
            age: 16,
            address: "慕和兰道304",
        },
        {
            key: "2",
            name: "张海新",
            age: 17,
            address: "慕和兰道304",
            editable: false
        },
        {
            key: "3",
            name: "李鳌",
            age: 15,
            address: "慕和兰道304"
        }
    ];

    const columns = [
        {
            title: "姓名",
            dataIndex: "name",
            key: "name",
            width: "30%"
        },
        {
            title: "年龄",
            dataIndex: "age",
            key: "age",
            width: "30%"
        },
        {
            title: "住址",
            dataIndex: "address",
            key: "address",
            editable: false
        }
    ];

    function handleCellChange(nextSource){
        console.log(nextSource);
    }

    <Editable
        dataSource={dataSource}
        columns={columns}
        onCellChange={handleCellChange}
        bordered
    />

    ...
```

[更多用法](https://alkaids.github.io/antd-editable/)

## API

同 [antd-table](https://ant.design/components/table-cn/) 的 API 。只需在 colums 和 dataSource 里加入 editable 属性控制行列的可编辑。

<table>
    <thead>
        <tr>
            <th>
                参数
            </th>
            <th>
                说明
            </th>
            <th>
                类型
            </th>
            <th>
                默认值
            </th>                                    
        </tr>
    </thead>
    <tbody>
          <tr>
            <td>
                columns
            </td>
            <td>
                列描述数据对象
            </td> 
            <td>
                object[]
            </td>  
            <td>
                []
            </td>                 
        </tr>    
          <tr>
            <td>
                dataSource
            </td>
            <td>
                数据数组
            </td> 
            <td>
                any[]
            </td>  
            <td>
                []
            </td>                 
        </tr>    
         <tr>
            <td>
                onCellChange
            </td>
            <td>
                改变dataSource的方法
            </td> 
            <td>
                function
            </td>  
            <td>
                -
            </td>                 
        </tr>   
        <tr>
            <td>
                onSubmit
            </td>
            <td>
                保存按钮回调，如传入此属性，则会在表格下方多出一个button
            </td> 
            <td>
                function
            </td>  
            <td>
                -
            </td>                 
        </tr> 
        <tr>
            <td>
                btnProps
            </td>
            <td>
                保存按钮的props, 与onSubmit联用
            </td> 
            <td>
                object
            </td>  
            <td>
                { style: { marginTop: 10 } }
            </td>                 
        </tr>  
        <tr>
            <td>
                btnText
            </td>
            <td>
                保存按钮的文字, 与onSubmit联用
            </td> 
            <td>
                string
            </td>  
            <td>
                '保存'
            </td>                 
        </tr>          
        <tr>
            <td>
                -
            </td>
            <td>
                antd table 的其他属性
            </td>  
            <td>
                -
            </td>     
            <td>
                -
            </td>            
        </tr>
    </tbody>
</table>
