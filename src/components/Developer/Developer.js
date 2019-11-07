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
                Session Name: 
                <input
                    type="text"
                    value={sessionName}
                />
                Number of Voters 
                <input
                    type="number"
                    value={numberVoters}
                />
                Story List
                <textarea
                    value={storyList}
                />
            </div>
        )
    }
}

export default Developer