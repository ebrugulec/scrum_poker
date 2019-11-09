import React from "react";
import {
    Redirect
} from "react-router-dom";
import FireBaseHelper from '../../Firebase/FirebaseHelper'
import { Input } from 'antd';
import * as routes from '../../routes/routes'
import { Row, Col } from 'antd';
import Header from '../Layout/Header'
import ViewButton from '../View/ViewButton'

import './StoryList.scss'

//TODO: Initial Value Add
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

    handleChangeValue (event) {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    handleChangeStoryList (value) {
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

        this.setState({
            storyValue: value,
            storyList: returnStories
        })
    }

    startSession = () => {
        const { sessionName, votersCount, storyList, storyValue } = this.state
        const data = FireBaseHelper.setFirebase('scrum/',
            {
                sessionName,
                votersCount,
                storyList
            })
        this.setState({
            isSaved: true
        })
    }
    render() {
        const { sessionName, votersCount, storyList, storyValue, isSaved } = this.state

        if (isSaved) {
            return <Redirect to={routes.SCRUM_MASTER}/>
        }
        //TOTO: Seperate Input Elements To Component
        return (
            <div className="story-list">
                <Row>
                    <Header />
                </Row>
                <Row className="story-list__session">
                    <Col span={12}>
                        <span>Session Name: </span>
                        <Input
                            type="text"
                            value={sessionName}
                            name="sessionName"
                            onChange={e => this.handleChangeValue(e)}
                        />
                    </Col>
                    <Col span={12}>
                        <span>Number of Voters: </span>
                        <Input
                            type="number"
                            value={votersCount}
                            name="votersCount"
                            onChange={e => this.handleChangeValue(e)}
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
                    <ViewButton
                        text="Start Session"
                        className="start-session__button"
                        type="primary"
                        onClick={this.startSession}
                    />
                </div>
            </div>
        )
    }
}

export default StoryList
