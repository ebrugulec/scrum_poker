import React from 'react'

const Voters = (props) => {
    const { votersCount, votes, isShowVote } = props
    const voters = [];
    if (isShowVote && votes !== []) {
        for (let i = 1; i < votersCount; i++) {
            voters.push(
                <div>
                    <span className="voter-name">Voter {i}: </span>
                    <span>{votes[i]}</span>
                </div>)
        }
        voters.push(<div><span>ScrumMaster: {votes.sc_master}</span></div>)
    } else {
        for (let i = 1; i < votersCount; i++) {
            voters.push(
                <div>
                    <span className="voter-name">Voter {i}: </span>
                    <span>
                        {votes[i] !== undefined ? 'Voted' : 'Not Voted'}
                    </span>
                </div>)
        }
        voters.push(
            <div>
                <span>
                    ScrumMaster: {votes.sc_master !== undefined ? 'Voted': 'Not Voted'}
                </span>
            </div>)
    }
    return voters
}

export default Voters
