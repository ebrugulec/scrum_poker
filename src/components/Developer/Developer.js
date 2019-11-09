import React from "react";
import StoryListTable from '../ViewElements/StoryListTable'
import * as firebase from 'firebase'
import { Row, Col } from 'antd';
import Header from '../Layout/Header'
import { ScrumTableColumns } from '../../constants/ScrumConstants'
import ActiveStory from '../ViewElements/ActiveStory'
import FirebaseHelper from '../../Firebase/FirebaseHelper'
import helpers from '../../helpers'
import './Developer.scss'

//TODO: Add Initial Value
class Developer extends React.Component {
    constructor() {
        super();
        this.state = {
            sessionName: '',
            numberVoters: 0,
            storyList: [],
            votersCount: 0,
            activeStory: [],
            point: null
        }
    }

    componentDidMount () {
        this.getScrumInfo()
        this.getVoters()
    }

    getScrumInfo = async () => {
        const snapshot = await firebase.database().ref('scrum/').once('value', (snapshot) => {
            return snapshot
        })
        const scrum = snapshot.val()
        this.setState({
            storyList: scrum.storyList,
            votersCount: scrum.votersCount
        })
    }

    handleVote = async (point) => {
        const { votersCount } = this.state
        const snapshot = await firebase.database().ref('vote/').once('value', (snapshot) => {
            return snapshot
        })
        var vote_count
        let votes = snapshot.val()
        if (votes === null) {
            vote_count = 1
        } else if (votes.sc_master === undefined && votes !== null) {
            vote_count = helpers.getVoteCount(votes) + 1
        } else if (votes.sc_master !== undefined && votes !== null) {
            vote_count = helpers.getVoteCount(votes)
        } else {
            vote_count = helpers.getVoteCount(votes) + 1
        }
        if (vote_count < Number(votersCount)) {
            this.setState({
                point
            })
            let newVoter = {
            [vote_count]: point,
            ...snapshot.val()
            }
            this.saveDevVote(newVoter)
        }
    }

    saveDevVote = (newVoter) => {
        firebase.database().ref('vote/').set(newVoter).then((data) => {
            return data
        }).catch((error)=>{
            console.log('error ' , error)
        })
    }

    getVoters = async () => {
        const snapshot = await firebase.database().ref('scrum/').once('value', (snapshot) => {
            return snapshot
        })
        const scrum = snapshot.val()
        let activeStory = scrum.storyList.filter((story) => {
            return story.status == 'Active'
        })
        this.setState({
            storyList: scrum.storyList,
            activeStory: activeStory[0],
            votersCount: scrum.votersCount,
        })
    }

    render() {
        const { sessionName, numberVoters, storyList, activeStory, votersCount, point } = this.state
        console.log('point', point)
        return (
            <div className="developer">
                <Header />
                <Row>
                    <Col span={12}>
                        <StoryListTable storyList={storyList} columns={ScrumTableColumns} />
                    </Col>
                    <Col span={12} className="active-story">
                        <ActiveStory
                            handleVote={this.handleVote}
                            activeStory={activeStory}
                            point={point}
                        />
                    </Col>
                </Row>
            </div>
        )
    }
}

export default Developer