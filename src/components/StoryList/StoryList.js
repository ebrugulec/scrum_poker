import React from "react";
import {
    Redirect
} from "react-router-dom";
import { Input } from 'antd';
import * as firebase from 'firebase'
import * as routes from '../../constants/routes'
import { Row, Col, Button } from 'antd';
import './StoryList.scss'

const { TextArea } = Input;
class StoryList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sessionName: '',
            votersCount: 1,
            storyList: [],
            storyValue: '',
            isSaved: false
        }
    }

    handleChangeName (value) {
        this.setState({
            sessionName: value
        })
    }

    handleChangeVoters (value) {
        this.setState({
            votersCount: value
        })
    }

    handleChangeStoryList (value) {
        //TODO: Paste Story List
        const { votersCount } = this.state
        const newStoryList = value.split('\n')

        const returnStories = newStoryList.map((story, i) => {
            let list = {
                'story_name': story,
                'status': i === 0 ? 'Active' : 'Not Voted',
                'story_point': 0
            }
            return list
        })

        console.log(returnStories)
        this.setState({
            storyValue: value,
            storyList: returnStories
        })
    }

    startSession = () => {
        const { sessionName, votersCount, storyList, storyValue } = this.state

        firebase.database().ref('scrum/').set({
            sessionName,
            votersCount,
            storyList
        }).then((data)=>{
            this.setState({
                isSaved: true
            })
        }).catch((error) => {
            console.log('error ' , error)
        })
    }
    render() {
        const { sessionName, votersCount, storyList, storyValue, isSaved } = this.state

        if (isSaved) {
            return <Redirect to={routes.SCRUM_MASTER}/>;
        }
        return (
            <div className="story-list">
                <Row>
                    <h2>Scrum Master</h2>
                </Row>
                <Row className="story-list__session">
                    <Col span={12}>
                        <span>Session Name: </span>
                        <Input
                            type="text"
                            value={sessionName}
                            onChange={e => this.handleChangeName(e.target.value)}
                        />
                    </Col>
                    <Col span={12}>
                        <span>Number of Voters: </span> 
                        <Input
                            type="number"
                            value={votersCount}
                            onChange={e => this.handleChangeVoters(e.target.value)}
                            className="voter-counts"
                        />
                    </Col>
                </Row>
                <div className="list">
                    <span>Paste your Story List(Each Line will be converted as a story)</span>
                    <TextArea
                        rows={14}
                        value={storyValue}
                        onChange={e => this.handleChangeStoryList(e.target.value)}
                    />
                    <Button
                        className="start-session__button"
                        onClick={this.startSession}
                        type="primary">
                        Start Session
                    </Button>
                </div>
            </div>
        )
    }
}

export default StoryList