import * as firebase from 'firebase'

const setFirebase = (path, values) => {
    firebase.database().ref(path).set(values).then((data)=>{
        return data
    }).catch((error) => {
        console.log('error ' , error)
    })
}

const resetVote = async (path) => {
    const data = await firebase.database().ref(path).set({})
    return data
}

const saveDevVote = (path, values) => {
    firebase.database().ref('vote/').set({values}).then((data) => {
        return data
    }).catch((error)=>{
        console.log('error ' , error)
    })
}

const setVote = (path, value) => {
    firebase.database().ref(path).set({
        sc_master: value
    }).then((data) => {
        return data
    }).catch((error)=>{
        console.log('error ' , error)
    })
}

const updateScrum = (path, values) => {
    firebase.database().ref(path).update({
        storyList: values,
    }).then((data)=>{
        return data
    }).catch((error)=>{
        //TODO: Error Handling
        console.log('error', error)
    })
}

const FirebaseHelper = {
    setFirebase,
    setVote,
    resetVote,
    updateScrum,
    saveDevVote
}

export default FirebaseHelper
