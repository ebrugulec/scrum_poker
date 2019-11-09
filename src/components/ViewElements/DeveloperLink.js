import React from 'react'
import { Link } from 'react-router-dom'
import * as routes from '../../routes/routes'

const DeveloperLink = (props) => {
    return (
        <div className="developer-link">
            <Link to={routes.DEVELOPER}>Developer</Link>
        </div>
    )
}

export default DeveloperLink