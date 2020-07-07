import React, { Component } from 'react'
import MainContainer from '../component/Style/MainContainer'


class EmailConfirmation extends Component {

    render() {
        return (
            <MainContainer>
                <div className="container">
                   
                    <div className=" card-body text-center">
                       
                            <h3>Confirm your email address</h3>
                            <p>Please check your inbox for a confirmation email.
                            Click the link in the email to confirm your email address.
                        </p>
                            <p> After you verify, return to this page to continue.</p>
                            <p>Didn't receive the email? Send it again</p>
                     
                    </div>
                </div>
            </MainContainer>

        )
    }
}

export default EmailConfirmation;