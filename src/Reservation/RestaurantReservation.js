import React, { Component } from 'react'
import Parser from 'html-react-parser'
import $ from "jquery";
import dataService from '../Services/dataService';
import { ToastContainer, toast, cssTransition } from 'react-toastify';

class RestaurantReservation extends Component {

    constructor(props) {
        super(props);
        this.state = {
            upcoming: [],
            past: [],
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.querypast = this.querypast.bind(this);
        this.renderPast = this.renderPast.bind(this);
        this.queryPresent = this.queryPresent.bind(this);
        this.renderPresent = this.renderPresent.bind(this);
    }

    cancelReservation(reservationId){
        const infoToast = toast("Please Wait", {autoClose: false})
        dataService.restaurantCancelReservation(reservationId).then(res=>{
            toast.update(infoToast,{render: "Reservation cancelled", type: toast.TYPE.SUCCESS, autoClose: 5000, className: 'pulse animated'})
            $("#"+reservationId+"btn").attr('disabled', 'true').text("Cancelled")
        }).catch(err=>{
            if(err.errcode){
                toast.update(infoToast,{render: err.errmsg, type: toast.TYPE.ERROR, autoClose: 5000, className: 'pulse animated'})
            }else{
                toast.update(infoToast,{render: "error occured", type: toast.TYPE.ERROR, autoClose: 5000, className: 'pulse animated'})
            }
        })
    }

    confirmAttandance(reservationId){
        const infoToast = toast("Please Wait", {autoClose: false})
        dataService.restaurantConfirmReservation(reservationId).then(res=>{
            toast.update(infoToast,{render: "Reservation confirm", type: toast.TYPE.SUCCESS, autoClose: 5000, className: 'pulse animated'})
            $("#"+reservationId+"btn").attr('disabled', 'true').text("Confirm")
        }).catch(err=>{
            if(err.errcode){
                toast.update(infoToast,{render: err.errmsg, type: toast.TYPE.ERROR, autoClose: 5000, className: 'pulse animated'})
            }else{
                toast.update(infoToast,{render: "error occured", type: toast.TYPE.ERROR, autoClose: 5000, className: 'pulse animated'})
            }
        })

    }

    renderPresent() {
        var rows = [];
        for (var ro of this.state.upcoming) {
            console.log("RO")
            console.log(ro)
            rows.push(
                <tr key={rows} id={ro._id}>
                    <td >
                        {ro.customer.firstName + " " + ro.customer.lastName}
                    </td>

                    <td >
                        {ro.table.rid}
                    </td>

                    <td >
                        {ro.dateTime}
                    </td>

                    <td >
                        {ro.numOfPeople}
                    </td>

                    <td >
                        {ro.comments}
                    </td>

                    <td>
                        <button type="button" className="btn btn-success mr-sm-4"
                         id={ro._id + 'btn'}
                         onClick={() => this.confirmAttandance(ro._id)}>
                            Confirm Attandance 
                        </button>
                    </td>

                    <td>
                        <button type="button" className="btn btn-primary mr-sm-4 "
                            id={ro._id + 'btn'}
                            onClick={()=>this.cancelReservation(ro._id)}
                        >
                            Cancel Reservation </button>


                        {/* Cancel Modal */}
                        {/* This results in mutiple modals in the page. do not put this into a loop */}
                        {/* <div
                            className="modal fade"
                            id="cancelModal"
                            tabindex="-1"
                            role="dialog"
                            aria-labelledby="cancelLabel"
                            aria-hidden="true"
                        >
                            <div className="modal-dialog" role="document">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title" id="cancelModalLabel">
                                            Cancel Reservation
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
                                        <p className="alert alert-warning" id="signResultText">
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
                        </div> */}
                    </td>

                </tr>
            )
        }
        return rows;
    }

    queryPresent() {
        dataService.getRestaurantUpcomingReservation().then(res => {
            console.log(res.reservations);
            this.setState({
                upcoming: res.reservations,
            })
        })
    }

    renderPast() { //TODO: display reservation status
        var row = [];
        for (var r of this.state.past) {
            row.push(
                <tr key={row}>
                    <td >
                        {r.customer.firstName + " " + r.customer.lastName}
                    </td>

                    <td >
                        {r.table.rid}
                    </td>

                    <td >
                        {r.dateTime}
                    </td>

                    <td >
                        {r.numOfPeople}
                    </td>

                    <td >
                        {r.comments}
                    </td>

                </tr>
            )
        }
        return row;
    }

    querypast() {
        dataService.getRestaurantPastReservation().then(res => {
            console.log(res.reservations);
            this.setState({
                past: res.reservations,
            })
        })
    }

    handleChange(e) {
        e.preventDefault();
    }

    handleSubmit = (e) => {
        e.preventDefault();
    }

    componentWillMount() {
        this.querypast();
        this.queryPresent();
    }

    render() {
        return (
                <div className="card">
                    <div className="card-header">
                        <ul className="nav nav-tabs card-header-tabs">
                            <li className="nav-item">
                                <a className="nav-link active" data-toggle="tab" role="tab" href="#upcomingRes" aria-controls="upcomingRes" aria-selected="true">
                                    Upcoming Reservation
                                </a>

                            </li>
                            <li className="nav-item">
                                <a className="nav-link" data-toggle="tab" role="tab" href="#pastRes" aria-controls="pastRes" aria-selected="false">
                                    Past Reservation
                                </a>

                            </li>
                        </ul>
                    </div>

                    <div className="card-body">
                        <div className="tab-content">
                            {/* Start Upcoming Reservation */}
                            <div id="upcomingRes" className="tab-pane fade show active" role="tabpanel" aria-labelledby="upcomingRes">
                                <table className="table table-striped">
                                    <thead>
                                        <tr>
                                            <th scope="col">Customer</th>
                                            <th scope="col">Table</th>
                                            <th scope="col">Date</th>
                                            <th scope="col"># of People</th>
                                            <th scope="col">Comments</th>
                                            <th scope="col"></th>
                                            <th scope="col"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.renderPresent()}

                                    </tbody>
                                </table>
                            </div>
                            {/* End Upcoming Reservation */}

                            {/* Start Past Reservations */}
                            <div id="pastRes" className="tab-pane fade " role="tabpanel" aria-labelledby="pastRes">
                                <table className="table table-striped">
                                    <thead>
                                        <tr>
                                            <th scope="col">Customer</th>
                                            <th scope="col">Table</th>
                                            <th scope="col">Date</th>
                                            <th scope="col"># of People</th>
                                            <th scope="col">Comments</th>
                                        </tr>
                                    </thead>
                                    <tbody>

                                        {this.renderPast()}


                                    </tbody>
                                </table>
                            </div>
                            {/* End Past Reservations */}


                        </div>
                    </div>



                </div>
        )
    }

}

export default RestaurantReservation;