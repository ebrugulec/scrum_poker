import * as firebase from 'firebase'

const setFirebase = (path, values) => {
    firebase.database().ref(path).set(values).then((data)=>{
        return data
    }).catch((error) => {
        console.log('error ' , error)
    })
}

const FirebaseHelper = {
    setFirebase
}

export default FirebaseHelper
