import React from "react";
import * as firebase from 'firebase'
import { Table, Divider, Tag, Row, Col, Button } from 'antd';
import Header from '../Layout/Header'
import ViewButton from '../View/ViewButton'
import './ScrumMaster.scss'

const STORY_POINTS = [1,2,3,5,8,21,34,55,89,134, '?']

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
            finalScore: 1
        }
    }

    componentDidMount () {
        this.callFunction()
    }

    callFunction = async () => {
        const snapshot = await firebase.database().ref('scrum/').once('value', (snapshot) => {
            return snapshot
        })
        const scrum = snapshot.val()

        let activeStory = scrum.storyList.filter((story) => {
            return story.status !== 'Not Voted'
        })

        this.setState({
            storyList: scrum.storyList,
            activeStory: activeStory[0],
            votersCount: scrum.votersCount
        })

        var intervalId = setInterval(this.getVotes, 1000);
        this.setState({intervalId: intervalId});
    }

    componentWillUnmount () {
        clearInterval(this.state.intervalId);
     }

    handleVote = (value) => {
        firebase.database().ref('vote/').set({
            sc_master: value
        }).then((data) => {
            var intervalId = setInterval(this.getVotes, 1000);
            this.setState({
                infoText: value + ' Voted',
                intervalId
            })
        this.setState({intervalId: intervalId});
        }).catch((error)=>{
            console.log('error ' , error)
        })
    }

    getVotes = async () => {
        const { votersCount } = this.state
        const snapshot = await firebase.database().ref('vote/').once('value', (snapshot) => {
            return snapshot
        })

        if (snapshot.val() !== null) {
            const vote_count = Object.keys(snapshot.val()).length

            //TODO: type check (===)
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

    renderVoters = () => {
        const { votersCount, votes, isShowVote } = this.state
        const voters = [];

        if (isShowVote && votes !== []) {
            for (let i = 1; i < votersCount; i++) {
                voters.push(<div>
                                <span className="voter-name">Voter {i}: </span>
                                <span>{votes[i]}</span>
                            </div>);
            }
            voters.push(<div><span>ScrumMaster: {votes.sc_master}</span></div>)
            
        } else {
            for (let i = 1; i < votersCount; i++) {
                voters.push(<div>
                                <span className="voter-name">Voter {i}: </span>
                                <span>
                                    {votes[i] !== undefined ? 'Voted' : 'Not Voted'}
                                </span>
                            </div>)
            }
            voters.push(<div><span>ScrumMaster: {votes.sc_master !== undefined ? 'Voted': 'Not Voted'}</span></div>)
        }
        return voters
    }

    handleFinalScore = (value) => {
        this.setState({
            finalScore: value
        })
    }

    saveFinalScore = () => {
        //TODO: Remove vote table from firebase
        const { storyList, finalScore } = this.state
        let newStoryList = storyList
        for (let i in storyList) {
            if (newStoryList[i].status === 'Active') {
                newStoryList[i].status = 'Voted'
                newStoryList[i].story_point = finalScore
                var nextActiveIndex = Number(i)+1
            }
        }
        if (newStoryList[nextActiveIndex] !== undefined) {
            newStoryList[nextActiveIndex].status = 'Active'
        } 

        firebase.database().ref('scrum/').update({
            storyList: newStoryList,
        }).then((data)=>{
            this.setState({
                isShowVote: false,
                storyList: newStoryList,
                votersCount: 0,
                votes: [],
                isStopVoting: false
            })
        }).catch((error)=>{
            //error callback
        })
        //TODO: Burayi degistir

        firebase.database().ref('vote/').set({
        }).then((data) => {
            
        }).catch((error)=>{
        })
        this.callFunction()
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
            isStopVoting
        } = this.state

        const columns = [
            {
                title: 'Story',
                dataIndex: 'story_name',
                key: 'story_name',
            },
            {
                title: 'Story Point',
                dataIndex: 'story_point',
                key: 'story_point',
            },
            {
                title: 'Status',
                dataIndex: 'status',
                key: 'status',
            },
        ]
        const dataSource = []
        console.log('storyList', storyList)
        return (
            <div className="scrum-master">
                <Header />
                <Row>
                    <Col span={8}>
                        <span>
                            Story List
                        </span>
                        <Table dataSource={storyList} columns={columns} />
                    </Col>
                    <Col span={8}>
                        <div>
                            <span>Active Story: </span>
                           <span>{activeStory.story_name}</span>
                        </div>
                        <div className="scrum-master__points">
                            {STORY_POINTS.map(point => {
                                return <Button className="point_button" onClick={() => this.handleVote(point)}>{point}</Button>
                            })}
                        </div>
                    </Col>
                    <Col span={8}>
                        <div>
                            Scrum Master Panel
                            {this.renderVoters()}
                        </div>
                        {
                            isStopVoting ?
                            <div>
                                <input onChange={(e) => this.handleFinalScore(e.target.value)}></input>
                                <ViewButton
                                    text="Save Final Score"
                                    className=""
                                    type="danger"
                                    onClick={this.saveFinalScore}
                                />
                            </div>
                            :
                            <ViewButton
                                text="End Voting"
                                className=""
                                type="danger"
                                onClick={this.endVoting}
                            />
                        }
                    </Col>
                </Row>
            </div>
        )
    }
}

export default ScrumMaster