import React from 'react'
import { Button } from 'antd'

const ViewButton = (props) => {
    const { text, className, type, onClick } = props
    return (
        <Button
            className={className}
            onClick={onClick}
            type={type}>
            {text}
        </Button>
    )
}

export default ViewButton
