import React from 'react'
import { Table } from 'antd';

const StoryListTable = (props) => {
    const { storyList, columns } = props
    return (
        <>
            <span>
                Story List
            </span>
            <Table dataSource={storyList} columns={columns} />
        </>
    )
}

export default StoryListTable
