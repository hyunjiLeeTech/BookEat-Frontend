import axios from "axios";
import serverAddress from './ServerUrl'

const API_URL = serverAddress;

class AuthService {
    login(email, password) {
        return axios
            .post(API_URL + "/login", {
                email,
                password
            })
            .then(response => {
                if (response.data.errcode === 0) {
                    localStorage.setItem("user", JSON.stringify(response.data));
                } else {
                    console.log('login failed: ');
                    console.log(response.data)
                }
                return response;
            }).catch(err => console.log("AuthService Login: err: " + err));
    }
    logout() {
        return axios
            .get(API_URL + "/logout")
            .then(res=>{
                if(res.errcode !== 0){
                    console.log('logout error returned from server side')
                    console.log(response.data)
                }
                localStorage.removeItem("user");
                return res;
            })
    }

    getCurrentUser() {
        return JSON.parse(localStorage.getItem('user'));;
    }
    //TODO: get suer from server side
    getCurrentUserFromServer(){
        return {};
    }
}

export default new AuthService();