import React from "react";
import * as firebase from 'firebase'
import { Divider, Tag, Row, Col, Button } from 'antd';
import Header from '../Layout/Header'
import ViewButton from '../View/ViewButton'
import Voters from './Voters'
import ActiveStory from './ActiveStory'
import FirebaseHelper from '../../Firebase/FirebaseHelper'
import StoryListTable from '../View/StoryListTable'
import { ScrumTableColumns } from '../../constants/TableColumns'
import DeveloperLink from '../View/DeveloperLink'
import './ScrumMaster.scss'

//TODO: Add Initial Values
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
            votes: [],
            isStopVoting: false,
            finalScore: 1
        }
    }

    componentDidMount () {
        this.getScrumValues()
    }

    getScrumValues = async () => {
        const snapshot = await firebase.database().ref('scrum/').once('value', (snapshot) => {
            return snapshot
        })
        const scrum = snapshot.val()
        let activeStory = scrum.storyList.filter((story) => {
            return story.status !== 'Not Voted'
        })

        var intervalId = setInterval(this.getVotes, 1000);
        this.setState({
            storyList: scrum.storyList,
            activeStory: activeStory[0],
            votersCount: scrum.votersCount,
            intervalId
        })
    }

    componentWillUnmount () {
        clearInterval(this.state.intervalId);
    }

    handleVote = (value) => {
        const data = FirebaseHelper.setVote('vote/', value)
        let intervalId = setInterval(this.getVotes, 1000);
        this.setState({
            infoText: value + ' Voted',
            intervalId
        })
    }

    getVotes = async () => {
        const { votersCount } = this.state
        const snapshot = await firebase.database().ref('vote/').once('value', (snapshot) => {
            return snapshot
        })

        if (snapshot.val() !== null) {
            const vote_count = Object.keys(snapshot.val()).length

            if (vote_count == votersCount) {
                clearInterval(this.state.intervalId)
            }
            this.setState({
                votes: snapshot.val()
            })
        } else {
            clearInterval(this.state.intervalId)
        }
    }

    endVoting = async () => {
        const { votersCount } = this.state
        const snapshot = await firebase.database().ref('vote/').once('value', (snapshot) => {
            return snapshot
        })

        const vote_count = Object.keys(snapshot.val()).length
        if ((votersCount == vote_count) && vote_count !== undefined) {
            this.setState({
                isShowVote: true,
                isStopVoting: true
            })
            clearInterval(this.state.intervalId)
        } else {
            alert('Please wait')
        }
    }

    handleFinalScore = (value) => {
        this.setState({
            finalScore: value
        })
    }

    changeTableStatus = (storyList, finalScore) => {
        for (let i in storyList) {
            if (storyList[i].status === 'Active') {
                storyList[i].status = 'Voted'
                storyList[i].story_point = finalScore
                var nextActiveIndex = Number(i)+1
            }
        }
        if (storyList[nextActiveIndex] !== undefined) {
            storyList[nextActiveIndex].status = 'Active'
        }
        return storyList
    }

    saveFinalScore = () => {
        const { storyList, finalScore } = this.state
        let newStoryList = this.changeTableStatus(storyList, finalScore)

        FirebaseHelper.updateScrum('scrum/', newStoryList)
        FirebaseHelper.resetVote('vote/')

        this.setState({
            isShowVote: false,
            storyList: newStoryList,
            votersCount: 0,
            votes: [],
            isStopVoting: false
        })

        this.getScrumValues()
    }
    render() {
        const {
            sessionName,
            numberVoters,
            storyList,
            activeStory,
            votersCount,
            infoText,
            votes,
            isShowVote,
            isStopVoting
        } = this.state
        return (
            <div className="scrum-master">
                <DeveloperLink />
                <Header />
                <Row>
                    <Col span={8}>
                        <StoryListTable storyList={storyList} columns={ScrumTableColumns} />
                    </Col>
                    <Col span={8}>
                        <ActiveStory
                            handleVote={this.handleVote}
                            activeStory={activeStory}
                        />
                    </Col>
                    <Col span={8}>
                        <div>
                            Scrum Master Panel
                            <Voters
                                //TODO: Make different component
                                votersCount={votersCount}
                                votes={votes}
                                isShowVote={isShowVote}
                            />
                        </div>
                        {
                            isStopVoting ?
                            <div>
                                <input onChange={(e) => this.handleFinalScore(e.target.value)}></input>
                                <ViewButton
                                    text="Save Final Score"
                                    className=""
                                    type="danger"
                                    onClick={this.saveFinalScore}
                                />
                            </div>
                            :
                            <ViewButton
                                text="End Voting"
                                className=""
                                type="danger"
                                onClick={this.endVoting}
                            />
                        }
                    </Col>
                </Row>
            </div>
        )
    }
}

export default ScrumMaster