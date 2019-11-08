import React from "react";
import {
    Redirect
} from "react-router-dom";
import { Input } from 'antd';
import * as firebase from 'firebase'
import * as routes from '../../constants/routes'
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
            <div>
                Session Name: 
                <Input
                    type="text"
                    value={sessionName}
                    onChange={e => this.handleChangeName(e.target.value)}
                />
                
                Number of Voters 
                <input
                    type="number"
                    value={votersCount}
                    onChange={e => this.handleChangeVoters(e.target.value)}
                />
                Story List
                <textarea
                    value={storyValue}
                    onChange={e => this.handleChangeStoryList(e.target.value)}
                />
                <button onClick={this.startSession}>Start Session</button>
            </div>
        )
    }
}

export default StoryList