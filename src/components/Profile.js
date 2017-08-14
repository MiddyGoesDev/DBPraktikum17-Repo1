import './Profile.css';

import React from 'react'
import {connect} from 'react-redux'

class Profile extends React.Component {

    constructor(props){
        super(props);
        this.state={        }
    }


    render() {
        return (
            <div className="profile">
                <div className="main-profile">
                    <div className="picstats">
                        <div className="profile-pic">
                            profile-pic
                        </div>

                        <div className="statistics">
                            statistics
                        </div>
                    </div>

                    <div className="equip">
                        equip
                    </div>
                </div>

                <div className="spellbar">
                    spellbar
                </div>
            </div>
        );
    }
}

export default connect(null, null)(Profile)
