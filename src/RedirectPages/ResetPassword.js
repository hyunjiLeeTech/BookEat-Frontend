import React, { Component } from "react";
import MainContainer from "../component/Style/MainContainer"
import Parser from "html-react-parser";
import sha256 from "crypto-js/sha256";
import FullscreenError from '../component/Style/FullscreenError';


const regExpPassword = RegExp(
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,32}$/
);

const formValid = ({ isError, ...rest }) => {
    let isValid = false;

    Object.values(isError).forEach((val) => {
        if (val.length > 0) {
            isValid = false;
        } else {
            isValid = true;
        }
    });

    Object.values(rest).forEach((val) => {
        if (val === null) {
            isValid = false;
        } else {
            isValid = true;
        }
    });

    return isValid;
};

class ResetPassword extends Component {

    constructor(props) {
        super(props);
        this.state = {
            newPassword: "",
            confirmpw: "",
            isError: {
                newPassword: "&#160;",
                confirmpw: "&#160;"
            },
            resultsErr: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange = (e) => {
        e.preventDefault();
        const { name, value } = e.target;
        let isError = { ...this.state.isError };
        switch (name) {
            case "newPassword":
                isError.newPassword = regExpPassword.test(value)
                    ? "&#160;"
                    : "At least 6 characters required";
                this.state.newPassword = value;
                break;
            case "confirmpw":
                this.state.confirmpw = value;
                isError.confirmpw =
                    this.state.confirmpw === this.state.newPassword
                        ? "&#160;" : "Password not matching"
                break;
            default:
                break;
        }
        this.setState({
            isError,
            [e.target.id]: e.target.value,
        });
    };

    handleSubmit = (e) => {
        console.log("submitting")
        e.preventDefault();
        if (formValid(this.state)) {
            this.state.password = sha256(this.state.password).toString(); //hashing password
            this.state.newPassword = sha256(this.state.newPassword).toString();

            //   const infoToast = toast("We are updating your password, Please wait", { type: toast.TYPE.INFO, autoClose: false, });
            //   dataService.changeAccountPassword(this.state.password, this.state.newPassword).then((res) => {
            //     toast.update(infoToast, { render: "Password Updated", type: toast.TYPE.SUCCESS, autoClose: 5000, className: 'pulse animated' })
            //   }).catch(err => {
            //     console.log(err)
            //     toast.update(infoToast, { render: "Error Occured", type: toast.TYPE.ERROR, autoClose: 5000 })
            //   }).finally(() => {
            //     this.setState({
            //       newPassword: '',
            //       password: '',
            //       confirmpw: '',
            //     })
            //   })

        } else {
            console.log("Form is invalid!");
        }
    };

    componentDidMount() {
        var t2 = document.getElementById("newPassword");
        t2.onkeypress = function (e) {
            if (e.keyCode === 32) return false;
        };
        var t1 = document.getElementById("confirmpw");
        t1.onkeypress = function (e) {
            if (e.keyCode === 32) return false;
        };
    }

    render() {
        const { isError } = this.state;

        return (
            <MainContainer>
                {this.state.resultsErr
                    ?
                    FullscreenError("An error occured, please try again later")
                    :
                    null
                }
                <div className="container">
                    <div className="page-header text-center">
                        <br />
                        <br/>
                        <h3>Reset password</h3>
                        <br />

                    </div>
                </div>

                <form onSubmit={this.handleSubmit} noValidate>
                  
                    <div className="text-center">
                        <div className="form-group row">
                            <label
                                htmlFor="newPassword"
                                className="col-sm-3 col-form-label"
                            >
                                New Password{" "}
                            </label>
                            <div className="col-sm-6">
                                <input
                                    name="newPassword"
                                    type="password"
                                    id="newPassword"
                                    className={
                                        isError.newPassword.length > 6
                                            ? "is-invalid form-control"
                                            : "form-control"
                                    }
                                    value={this.state.newPassword}
                                    placeholder="Enter new password"
                                    onChange={this.handleChange}
                                    required
                                />
                                {isError.newPassword.length > 0 && (
                                    <span className="invalid-feedback">
                                        {Parser(isError.newPassword)}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="text-center">
                        <div className="form-group row">
                            <label
                                htmlFor="confirmpw"
                                className="col-sm-3 col-form-label"
                            >
                                Password confirmation{" "}
                            </label>
                            <div className="col-sm-6">
                                <input type="password" name="confirmpw" id="confirmpw" className={isError.confirmpw.length > 6 ? "is-invalid form-control" : "form-control"} value={this.state.confirmpw} placeholder="Confirm Password"
                                    onChange={this.handleChange} required />
                                <span className="invalid-feedback">{Parser(isError.confirmpw)}</span>
                            </div>
                        </div>
                        
                        <br/>

                        <div className="form-group ">
                            <div className="text-center">
                                <button type="submit" className="btn btn-info">
                                    Submit
                          </button>
                            </div>
                        </div>
                    </div>
                </form>

            </MainContainer>
        )
    }

}

export default ResetPassword;