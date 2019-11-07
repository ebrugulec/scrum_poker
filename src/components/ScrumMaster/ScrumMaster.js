import React from "react";

class ScrumMaster extends React.Component {
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
                <div>
                    
                </div>
                <button>Start Session</button>
            </div>
        )
    }
}

export default ScrumMaster