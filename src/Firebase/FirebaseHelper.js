import * as firebase from 'firebase'

const setFirebase = (path, values) => {
    firebase.database().ref(path).set(values).then((data)=>{
        return data
    }).catch((error) => {
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

const resetVote = async (path) => {
    const data = await firebase.database().ref(path).set({})
    return data
}

const FirebaseHelper = {
    setFirebase,
    setVote,
    resetVote
}

export default FirebaseHelper
