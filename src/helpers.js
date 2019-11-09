//TODO: Add explanation comments to each helpers

const getVoteCount = (votes) => {
    return Object.keys(votes).length
}

const checkVoterValue = (voterCount) => {
    return (voterCount > 0 && voterCount !== '') ? true : false
}

const helpers = {
    getVoteCount,
    checkVoterValue
}

export default helpers