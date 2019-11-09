import React from 'react'
import { Button } from 'antd'
import { StoryPoints } from '../../constants/ScrumConstants'

const ActiveStory = (props) => {
    const { handleVote, activeStory, point } = props
    return (
        <>
            <div>
                <span>Active Story: </span>
                <span>{activeStory.story_name}</span>
            </div>
            <div className="scrum-master__points">
                {StoryPoints.map(point => {
                    return <Button className="point_button" onClick={() => handleVote(point)}>{point}</Button>
                })}
            </div>
            <span className="point">
                {
                    point !== null ? <span>{point} Voted!</span> : 'Not Voted!'
                }
            </span>
        </>
    )
}

export default ActiveStory
