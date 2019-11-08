import React from "react";

class Developer extends React.Component {
    constructor() {
        super();
        this.state = {
            sessionName: '',
            numberVoters: 0,
            storyList: []
        }
    }

    handleChange (event) {
        console.log(event)
    }
    render() {
        const { sessionName, numberVoters, storyList } = this.state
        return (
            <div>
                aa
            </div>
        )
    }
}

export default Developer