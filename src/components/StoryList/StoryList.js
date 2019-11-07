import React from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";

class StoryList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sessionName: '',
            numberVoters: 0,
            storyList: [],
            storyValue: ''
        }
    }

    handleChangeName (value) {
        this.setState({
            sessionName: value
        })
    }

    handleChangeVoters (value) {
        this.setState({
            numberVoters: value
        })
    }

    handleChangeStoryList (value) {

        let newStoryList = value.split('\n')

        this.setState({
            storyValue: value,
            storyList: newStoryList
        })
    }
    render() {
        const { sessionName, numberVoters, storyList, storyValue } = this.state
        console.log(storyList)
        return (
            <div>
                <Link to="/scrum_master">Scrum Master</Link>
                Session Name: 
                <input
                    type="text"
                    value={sessionName}
                    onChange={e => this.handleChangeName(e.target.value)}
                />
                Number of Voters 
                <input
                    type="number"
                    value={numberVoters}
                    onChange={e => this.handleChangeVoters(e.target.value)}
                />
                Story List
                <textarea
                    value={storyValue}
                    onChange={e => this.handleChangeStoryList(e.target.value)}
                />
                <button>Start Session</button>
            </div>
        )
    }
}

export default StoryList