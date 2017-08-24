import * as React from 'react';
import {NavLink} from "react-router-dom";

export default class Footer extends React.Component {

    // TODO credits leer und schlecht platziert, erstmal entfernt
    render() {
        return (
            <div className="ui centered grid" style={{paddingTop: '10px'}}>
                <NavLink to="/credits">
                </NavLink>
            </div>
        )
    }
}