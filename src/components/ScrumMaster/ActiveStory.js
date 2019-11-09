import React from 'react'
import { Button } from 'antd'

const STORY_POINTS = [1,2,3,5,8,21,34,55,89,134, '?']

const ActiveStory = (props) => {
    const { handleVote, activeStory } = props
    return (
        <>
            <div>
                <span>Active Story: </span>
                <span>{activeStory.story_name}</span>
            </div>
            <div className="scrum-master__points">
                {STORY_POINTS.map(point => {
                    return <Button className="point_button" onClick={() => handleVote(point)}>{point}</Button>
                })}
            </div>
        </>
    )
}

export default ActiveStory
