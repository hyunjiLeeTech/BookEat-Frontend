import React, { Component } from 'react'
import { NavLink, Link } from 'react-router-dom'
import dataService from '../Services/dataService';
import MainContainer from '../component/Style/MainContainer';
import $ from 'jquery';
import Layout from '../component/RestaurantLayout/Layout'
import { Animated } from 'react-animated-css';
import Axios from 'axios';
import authHeader from '../Services/authHeader';
import { withRouter } from "react-router";

class Reserve extends Component {
    constructor(props) {
        super(props)
        this.state = {
            numofpeople: 0,
            dateTime: new Date(),
            resId: this.props.match.params.id, //FIXME FOR DEBUG
            tablestatus: false,
            tables: [],
            formIsVisible: true,
            tableIsVisible: false,
            resultIsVisible: false,
            selectedtableId: '',
            result: {},
            rorminfo: {
                OwnerAccount: "",
                Managers: ""
            },
            menuItems: [],
            selectedMenuItems: new Set(),
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.back = this.back.bind(this);
        this.book = this.book.bind(this);
        this.setTableId = this.setTableId.bind(this);
        this.getRoRmInfo = this.getRoRmInfo.bind(this);
        this.getMenuInfo = this.getMenuInfo.bind(this);
        this.renderMenuItems = this.renderMenuItems.bind(this);
    }

    setTableId(id) {
        this.setState({
            selectedtableId: id
        })
    }

    getRoRmInfo() {//TODO: only for testing, should be deleted in production envinroment.
        Axios.post("http://localhost:5000/Restaurant/getRestaurantOwnerAndManagerViaRestaurantId", { restaurantId: this.state.resId }, { headers: authHeader() }).then(res => {
            console.log(res)
            this.setState({
                rorminfo: {
                    OwnerAccount: res.data.Owner.account,
                    Managers: res.data.Managers
                }
            })
        })
    }

    componentDidMount() {
        this.getRoRmInfo();
        this.getMenuInfo();
    }

    handleSubmit(e) {
        var react = this;
        e.preventDefault();
        console.log("submit")
        var numofpeople = $('#numofpeople').val();
        var date = $('#date').val();
        var time = $('#time').val();
        var resId = this.state.resId;
        var dateTime = new Date(Date.parse(date + ' ' + time));
        console.log(numofpeople)
        console.log(date)
        console.log(time)
        this.setState({
            resId: resId,
            dateTime: dateTime,
            numofpeople: numofpeople
        })
        dataService.getTableStatus({
            resId: resId,
            numOfPeople: numofpeople,
            dateTime: dateTime
        }).then(res => {
            this.setState({
                formIsVisible: false,
                tables: res.tables
            })
            setTimeout(() => {
                this.setState({
                    tableIsVisible: true,
                })
            }, 500)

            console.log(this.state)
        }).catch(err => {
            console.log(err)
        })
    }
    renderForm() {
        return (
            <form onSubmit={this.handleSubmit} className="needs-validation" noValidate>
                <div className="page-header text-left" style={{ marginTop: '10%' }}>
                    <Animated animationIn="fadeIn" animationOut="fadeOut" isVisible={true}>
                        <h3>Please provide your information to reserve</h3>
                    </Animated>
                </div>
                <div className="col-xs-12 col-md-12 ">

                    <div className="form-group row">
                        <label htmlFor="numofpeople" className="col-sm-2 col-form-label" > Number of people </label>
                        <div className="col-sm-6">
                            <input type="number" id="numofpeople" name="numofpeople" placeholder="Number of People"
                                className='form-control' required />
                            {/* <span className="valid-feedback"></span> */}
                        </div>
                    </div>
                    <div className="form-group row">
                        <label htmlFor="date" className="col-sm-2 col-form-label" > Date </label>
                        <div className="col-sm-6">
                            <input type="date" id="date" name="date" placeholder="date"
                                className='form-control' required />
                            {/* <span className="valid-feedback"></span> */}
                        </div>
                    </div>

                    <div className="form-group row">
                        <label htmlFor="time" className="col-sm-2 col-form-label" > Time </label>
                        <div className="col-sm-6">
                            <input type="text" id="time" name="time" placeholder="time"
                                className='form-control' required />
                            {/* <span className="valid-feedback"></span> */}
                        </div>
                    </div>
                    {this.renderMenuItems(this.state.menuItems)}
                    <button type="submit" className="btn btn-primary" data-toggle="modal" data-target="#signResultModal" >Next</button>
                    {/* TODO: for testing */}
                    <div style={{wordWrap: 'break-all', whiteSpace: 'pre-wrap'}}>
                        <p>RestaurantID: {this.state.resId}</p>
                        <br /><br />
                        <p>OwnerAccountInfo: <code>{JSON.stringify(this.state.rorminfo.OwnerAccount)}</code></p><br /><br />
                        <p>ManagersInfo: <code>{JSON.stringify(this.state.rorminfo.Managers)}</code></p>
                    </div>
                    <div>
                        {JSON.stringify(this.state.menuItems)}
                    </div>

                </div>
            </form>
        )
    }

    back() {
        this.setState({
            formIsVisible: true,
            tableIsVisible: false,
        })
        setTimeout(() => {
            this.setState({
                tablestatus: false,
            })

            while (this.state.tables.length > 0) {
                this.state.tables.pop();
            }
        }, 500)
    }

    book() {
        console.log(this.state);
        dataService.customersReserve({
            numOfPeople: this.state.numofpeople,
            dateTime: this.state.dateTime,
            tableId: this.state.selectedtableId,
            comments: this.state.comments,
            menuItems: Array.from(this.state.selectedMenuItems),
        }).then(res => {
            if (res.errcode === 0) {
                console.log(res)
                this.setState({
                    tableIsVisible: false,
                    tablestatus: false,
                })



                setTimeout(() => {
                    this.setState({
                        resultIsVisible: true,
                        result: res.reservation,
                    })
                }, 500)
            }

        }).catch(err => {
            console.log(err)
        })
    }

    getMenuInfo(){
        var id = this.state.resId;
        dataService.getMenusCustomer(id).then(res=>{
            console.log(res.menus)
            this.setState({
                menuItems: res.menus,
            })
        }).catch(err=>{
            console.log(err)
        })
    }    

    renderMenuItems(items){
        var tr = [];
        var reactThis = this;
        var handler = function(e){
            if(e.target.checked){
                reactThis.state.selectedMenuItems.add(e.target.value);
            }else{
                reactThis.state.selectedMenuItems.delete(e.target.value);
            }
            console.log(reactThis.state.selectedMenuItems)
        }
        for(var item of items){
            tr.push(
                <div>
                <input type='checkbox' value={item._id} onChange={handler}/>
                <label>{item.menuName}</label>
            </div>
            )
        }
        return tr;
    }

    render() {
        return (
            //partial code from https://tobiasahlin.com/spinkit/, modified.
            <MainContainer>
                <div className="row">
                    {this.state.formIsVisible ?

                        <div className="row">
                            <div className='col-md-8'>
                            {this.renderForm()}
                            </div>
                            <div className='col-md-4'>
                                <img src="https://images.pexels.com/photos/6267/menu-restaurant-vintage-table.jpg?cs=srgb&dl=table-in-vintage-restaurant-6267.jpg&fm=jpg" style={{ marginTop: '5%' }} className="col-md-12" />
                                <h4 style={{ marginLeft: '5%' }}>Test Restaurant</h4>
                                <p style={{ marginLeft: '10%' }}>Restaurant Decription goes here</p>
                            </div>
                        </div>
                        : null}

                    {this.state.tableIsVisible ?
                        <div className="col-xs-12 col-md-12">
                                <div className="page-header text-left" style={{ marginTop: '5%' }}>
                                    <h3>Please Select a table</h3>
                                </div>
                                <Layout tables={this.state.tables} setTableId={this.setTableId} />
                                <div className="row">
                                    <div className="col-md-3">
                                        <button className="btn btn-warning" onClick={this.back}>Back</button>
                                    </div>
                                    <div className="col-md-6">

                                    </div>
                                    <div className="col-md-2">
                                        <button className="btn btn-primary" onClick={this.book}>Book</button>
                                    </div>
                                </div>
                        </div> : null}
                    {this.state.resultIsVisible ?
                            <div className="page-header text-left" style={{ marginTop: '5%' }}>
                                <h3>Thanks for reserving</h3>
                                <h4>This is your reservation:</h4>
                                <p>Customer Name: {this.state.result.customer.firstName + " " + this.state.result.customer.lastName}</p>
                                <p>Time: {new Date(this.state.result.dateTime).toString()}</p>
                                <p>Restaurant: {this.state.result.restaurant.resName}</p>
                                <p>Number of People: {this.state.result.numOfPeople}</p>
                                <p>Restaurant Phone Number: {this.state.result.restaurant.businessNum}</p>
                            </div>
                         : null}


                </div>
            </MainContainer>
        )
    }

}


export default withRouter(Reserve);