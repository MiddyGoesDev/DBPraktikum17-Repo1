import * as React from 'react';
import {NavLink} from "react-router-dom";

export default class Footer extends React.Component {

    render() {
        return (
            <div className="ui centered grid" style={{paddingTop: '10px'}}>
                <NavLink to="/credits">
                    Credits
                </NavLink>
            </div>
        )
    }
}