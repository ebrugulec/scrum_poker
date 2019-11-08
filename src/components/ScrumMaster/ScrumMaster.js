import React from "react";
import * as firebase from 'firebase'

const STORY_POINTS = [1,2,3,5,8,21,34,55,89,134]

class ScrumMaster extends React.Component {
    constructor() {
        super();
        this.state = {
            sessionName: '',
            numberVoters: 0,
            storyList: [],
            activeStory: [],
            votersCount: 1,
            infoText: 'Please Vote !!!',
            intervalId: 0,
            isShowVote: false,
            votes: []
        }
    }

    handleChange (event) {
        console.log(event)
    }

    async componentDidMount () {
        const snapshot = await firebase.database().ref('scrum/').once('value', (snapshot) => {
            return snapshot
        })
        const scrum = snapshot.val()

        let activeStory = scrum.storyList.filter((story) => {
            return story.status !== 'Not Voted'
        })
        console.log('storyList', activeStory[0])

        this.setState({
            storyList: scrum.storyList,
            activeStory: activeStory[0],
            votersCount: scrum.votersCount
        })

        var intervalId = setInterval(this.getVotes, 1000);
        this.setState({intervalId: intervalId});
    }

    componentWillUnmount () {
        clearInterval(this.state.intervalId);
     }

    handleVote = (value) => {
        console.log(value)
        firebase.database().ref('vote/').set({
            sc_master: value
        }).then((data) => {
            var intervalId = setInterval(this.getVotes, 1000);
            this.setState({
                infoText: value + ' Voted',
                intervalId
            })
        this.setState({intervalId: intervalId});
        }).catch((error)=>{
            console.log('error ' , error)
        })
    }

    getVotes = async () => {
        const snapshot = await firebase.database().ref('vote/').once('value', (snapshot) => {
            return snapshot
        })

        console.log('votes', snapshot.val())
    }

    getVotes = async () => {
        const { votersCount } = this.state
        const snapshot = await firebase.database().ref('vote/').once('value', (snapshot) => {
            return snapshot
        })
        console.log('snapshot.val()', snapshot.val())

        if (snapshot.val() !== null) {
            const vote_count = Object.keys(snapshot.val()).length

            //TODO: type check (===)
            if (vote_count == votersCount) {
                clearInterval(this.state.intervalId)
                this.setState({
                    isShowVote: true,
                })
            }
            this.setState({
                votes: snapshot.val()
            })
        } else {
            clearInterval(this.state.intervalId)
        }
    }

    endVoting = () => {
        this.setState({
            isShowVote: true
        })
        clearInterval(this.state.intervalId)
    }
    render() {
        const { sessionName, numberVoters, storyList, activeStory, votersCount, infoText, votes, isShowVote } = this.state
        const voters = [];
        for (let i = 1; i < votersCount; i++) {
            console.log('hey', votes[1])
            voters.push(<div><span>Voter {i}: {votes[i] !== undefined ? 'Voted' : 'Not Voted'}</span></div>);
        }
        return (
            <div>
                {storyList.map((story) => {
                    return <div>
                        <div>{story.story_name} - {story.story_point === 0 ? '' : story.story_point} - {story.status}</div>
                    </div>
                })}
----------
                <div>
                    {activeStory.story_name}
                    {STORY_POINTS.map(point => {
                        return <button onClick={() => this.handleVote(point)}>{point}</button>
                    })}
                </div>
                    Heyyyyyy - {infoText}
                    -------------
                <div>
                    Scrum Master Panel
                    {voters}
                    ScrumMaster: {(votes.sc_master !== undefined && !isShowVote) ? votes.sc_master : 'Not Voted'}
                </div>
                <button onClick={this.endVoting}>End Voting</button>
            </div>
        )
    }
}

export default ScrumMaster