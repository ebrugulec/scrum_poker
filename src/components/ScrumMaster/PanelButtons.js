import React from 'react'
import ViewButton from '../ViewElements/ViewButton'

const PanelButtons = (props) => {
    const { isStopVoting, handleFinalScore, saveFinalScore, endVoting } = props
    return (
        <>
            {
                isStopVoting ?
                    <div>
                        <input onChange={(e) => handleFinalScore(e.target.value)}></input>
                        <br/><br/>
                        <ViewButton
                            text="Save Final Score"
                            className=""
                            type="danger"
                            onClick={saveFinalScore}
                        />
                    </div>
                    :
                    <ViewButton
                        text="End Voting"
                        className=""
                        type="danger"
                        onClick={endVoting}
                    />
            }
        </>
    )
}

export default PanelButtons
