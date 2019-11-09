import React from "react";
import StoryListTable from '../ViewElements/StoryListTable'
import * as firebase from 'firebase'
import { Row, Col } from 'antd';
import Header from '../Layout/Header'
import { ScrumTableColumns } from '../../constants/ScrumConstants'
import ActiveStory from '../ScrumMaster/ActiveStory'
import './Developer.scss'

class Developer extends React.Component {
    constructor() {
        super();
        this.state = {
            sessionName: '',
            numberVoters: 0,
            storyList: [],
            activeStory: []
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
            storyList: scrum.storyList
        })
        console.log('scrum', scrum)
    }

    handleVote = () => {

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
        const { sessionName, numberVoters, storyList, activeStory } = this.state
        return (
            <div className="developer">
                <Header />
                <Row>
                    <Col span={12}>
                        <StoryListTable storyList={storyList} columns={ScrumTableColumns} />
                    </Col>
                    <Col span={12}>
                        <ActiveStory
                            handleVote={this.handleVote}
                            activeStory={activeStory}
                        />
                    </Col>
                </Row>
            </div>
        )
    }
}

export default Developer