import React, { Component } from 'react'
import './ResReview.css'
import Star from '../../component/Style/Stars'
import Parser from "html-react-parser";
import ds from "../../Services/dataService";

const formValid = ({ isError, ...rest }) => {
    let isValid = false;
    Object.values(isError).forEach((val) => {
        if (val !== '&#160;') {
            isValid = false;
        } else {
            isValid = true;
        }
    });

    Object.values(rest).forEach((val) => {
        console.log(rest);
        if (val === null) {
            isValid = false;
        } else {
            isValid = true;
        }
    });
    return isValid;
};


class ResReview extends Component {

    constructor(props) {
        super(props)
        this.state = {
            comment: '',
            food: 0,
            service: 0,
            enviroment: 0,
            satisfaction: 0,
            foodAvg: 0,
            serviceAvg: 0,
            environmentAvg: 0,
            satisfactionAvg: 0,
            reviews: [
            ],
            resId: props.resId,
            disabled: true,
            contenteditable: false,
            isError: {
                comment: "&#160;"
            }

        };


        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    async componentWillMount() {
        var resId = this.state.resId;

        await this.queryReviews(resId);
        console.log("after get reviews");
        console.log(this.state);
    }

    async queryReviews(resId) {
        var reviews = await ds.getReviewsRestaurantSide(resId);

        var serviceAvg = 0;
        var envirAvg = 0;
        var satisAvg = 0;
        var foodAvg = 0;


        if (typeof reviews !== 'undefined') {
            for (var i = 0; i < reviews.length; i++) {
                serviceAvg = typeof reviews[i].service !== 'undefined' ? serviceAvg + reviews[i].service : serviceAvg;
                envirAvg = typeof reviews[i].environment !== 'undefined' ? envirAvg + reviews[i].environment : envirAvg;
                satisAvg = typeof reviews[i].satisfaction !== 'undefined' ? satisAvg + reviews[i].satisfaction : satisAvg;
                foodAvg = typeof reviews[i].food !== 'undefined' ? foodAvg + reviews[i].food : foodAvg;
            }
        }

        this.setState({
            reviews: reviews,
            foodAvg: foodAvg / reviews.length,
            serviceAvg: serviceAvg / reviews.length,
            environmentAvg: envirAvg / reviews.length,
            satisfactionAvg: satisAvg / reviews.length,
        })

        console.log(this.state);
    }


    handleSubmit = (e) => {
        e.preventDefault();
        console.log("saved")
        console.log(this.state);
        ds.addReview(this.state);
    };


    handleChange(e) {
        e.preventDefault();
        const { name, value } = e.target;
        let isError = { ...this.state.isError };
        console.log(e.target.value);
        switch (name) {
            case "comment":
                isError.comment =
                    value.length >= 1 && value.length <= 255
                        ? "&#160;"
                        : "Write something please";
                break;
            default:
                break;
        }
        this.setState({ [e.target.id]: e.target.value });
    }

    queryReviewList() {
        var rows = [];
        console.log("this state reviews: " + this.state.reviews);
        if (typeof this.state.reviews != "undefined") {
            for (var review of this.state.reviews) {
                rows.push(
                    <div key={rows} className="row">

                        <div className="col-sm-4">
                            <div className="review-block-name">{review.customerId.firstName + " " + review.customerId.lastName}</div>
                            <div className="review-block-date">{review.updatedAt}</div>
                        </div>
                        <div className="col-sm-8">
                            <div className="review-block-rate col-sm-8">
                                <div className="form-group row">
                                    <label className="col-sm-5 col-form-label "> Food </label>
                                    <div className="col-sm-7">
                                        <Star type='splitedBar' stars={review.food} />
                                    </div>

                                    <label className="col-sm-5 col-form-label">Service </label>
                                    <div className="col-sm-7">
                                        <Star type='splitedBar' stars={review.service} />
                                    </div>

                                    <label className="col-sm-5 col-form-label">Satisfaction</label>
                                    <div className="col-sm-7">
                                        <Star type='splitedBar' stars={review.satisfaction} />
                                    </div>

                                    <label className="col-sm-5 col-form-label">Environment</label>
                                    <div className="col-sm-7">
                                        <Star type='splitedBar' stars={review.environment} />
                                    </div>
                                </div>
                            </div>
                            <div className="review-block-description">{review.comment}</div>
                            <hr />
                        </div>

                    </div>

                )
            }
        }
        return rows;
    }


    render() {
        const { isError } = this.state;
        return (
            <div className="container">
                <div className="row">

                    <div className="col-sm-4">
                        <div className="rating-block">
                            <h4>Users Rating</h4>
                            <h6>Food</h6>
                            <Star type='splitedBar' stars={3.8} />
                            <br />
                            <h6>Service</h6>
                            <Star type='splitedBar' stars={3.8} />
                            <br />
                            <h6>Satisfaction</h6>
                            <Star type='splitedBar' stars={3.8} />
                            <br />
                            <h6>Environment</h6>
                            <Star type='splitedBar' stars={3.8} />

                        </div>
                    </div>
                    <div className="col-sm-8 row">

                        <label className="col-sm-4 col-form-label">Food</label>
                        <div className="col-sm-6">
                            <Star id="food" name="food" isClickAble={true} type='star' onChange={this.handleChange} callback={
                                (e) => { this.setState({ food: e }) }
                            } />
                        </div>


                        <label className="col-sm-4 col-form-label">Service</label>
                        <div className="col-sm-6">
                            <Star id="service" name="service" isClickAble={true} type='star' onChange={this.handleChange} callback={
                                (e) => { this.setState({ service: e }) }
                            } />
                        </div>




                        <label className="col-sm-4 col-form-label">Satisfaction</label>
                        <div className="col-sm-6">
                            <Star id="satisfaction" name="satisfaction" isClickAble={true} type='star' onChange={this.handleChange} callback={
                                (e) => { this.setState({ satisfaction: e }) }
                            } />
                        </div>


                        <label className="col-sm-4 col-form-label">Environment</label>
                        <div className="col-sm-6">
                            <Star id="enviroment" name="enviroment" isClickAble={true} type='star' onChange={this.handleChange} callback={
                                (e) => { this.setState({ enviroment: e }) }
                            } />
                        </div>
                        <br />
                        <br />
                        <div className="col-sm-12">

                            <textarea
                                className="col-sm-12"
                                rows="4"
                                id="comment"
                                name="comment"
                                value={this.state.comment}
                                onChange={this.handleChange}
                            //   disabled={(!this.state.disabled)}
                            ></textarea>
                            <span className="invalid-feedback">
                                {Parser(isError.comment)}
                            </span>

                            <button type="submit" className="btn btn-primary float-right" onClick={this.handleSubmit}
                                data-toggle="modal"
                                data-target="#AddReviewModal"> Add Review</button>

                        </div>
                    </div>


                    {/* <div className="row"> */}
                    <div className="col-sm-12">
                        <hr />
                        <br />
                        <div className="review-block">
                            {this.queryReviewList()}
                        </div>
                    </div>
                </div>
                {/* </div> */}
                {/* Add Review Modal */}

                <div
                    className="modal fade"
                    id="AddReviewModal"
                    tabIndex="-1"
                    role="dialog"
                    aria-labelledby="AddReviewModal"
                    aria-hidden="true"
                >

                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="AddReviewModal">
                                    Add Review
                            </h5>
                                <button
                                    type="button"
                                    className="close"
                                    data-dismiss="modal"
                                    aria-label="Close"
                                >
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <p className="alert alert-warning" id="AddReviewModalText">
                                    Please Wait...
                  </p>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    data-dismiss="modal"
                                >
                                    Close
                  </button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

        )
    }

}

export default ResReview;
