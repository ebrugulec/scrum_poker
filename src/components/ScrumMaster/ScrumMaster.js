import React from "react";
import * as firebase from 'firebase'
import { Row, Col, Button } from 'antd';
import Header from '../Layout/Header'
import Voters from './Voters'
import ActiveStory from '../ViewElements/ActiveStory'
import FirebaseHelper from '../../Firebase/FirebaseHelper'
import StoryListTable from '../ViewElements/StoryListTable'
import { ScrumTableColumns } from '../../constants/ScrumConstants'
import DeveloperLink from '../ViewElements/DeveloperLink'
import PanelButtons from './PanelButtons'
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
            finalScore: 1,
            point: null
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
            return story.status == 'Active'
        })
        let intervalId = setInterval(this.getVotes, 2000);
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

    handleVote = (point) => {
        const data = FirebaseHelper.setVote('vote/', point)
        let intervalId = setInterval(this.getVotes, 2000);
        this.setState({
            intervalId,
            point
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
            isStopVoting: false,
            point: null
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
            isStopVoting,
            point
        } = this.state
        return (
            <div className="scrum-master">
                <DeveloperLink />
                <Header />
                <Row>
                    <Col span={8}>
                        <StoryListTable storyList={storyList} columns={ScrumTableColumns} />
                    </Col>
                    <Col span={8} className="active-story">
                        <ActiveStory
                            handleVote={this.handleVote}
                            activeStory={activeStory}
                            point={point}
                        />
                    </Col>
                    <Col span={8}>
                        <div>
                            Scrum Master Panel
                            <Voters
                                votersCount={votersCount}
                                votes={votes}
                                isShowVote={isShowVote}
                            />
                        </div>
                        <PanelButtons
                            isStopVoting={isStopVoting}
                            handleFinalScore={this.handleFinalScore}
                            saveFinalScore={this.saveFinalScore}
                            endVoting={this.endVoting}
                        />
                    </Col>
                </Row>
            </div>
        )
    }
}

export default ScrumMaster