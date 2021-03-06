import {authActionTypes as actionTypes} from '../constants';
import runtimeEnv from '@mars/heroku-js-runtime-env';
import {fetchTodos} from './todoActions';

function userLoggedIn(username){
    return {
        type: actionTypes.USER_LOGGEDIN,
        username: username
    }
}

function logout(){
    return {
        type: actionTypes.USER_LOGOUT
    }
}

export function submitLogin(data){
    const env = runtimeEnv();
    return dispatch => {
        return fetch(`${env.REACT_APP_API_URL}/signin`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
            mode: 'cors'})
            .then( (response) => {
                if (!response.ok) {
                    alert("Login Failed.");
                    throw Error(response.statusText);
                }
                return response.json();
            })
            .then( (res) => {
                localStorage.setItem('username', data.username);
                localStorage.setItem('token', res.token);

                dispatch(userLoggedIn(data.username));
                dispatch(fetchTodos());
            })
            .catch( (e) => console.log(e) );
    }
}

export function submitRegister(data){
    const env = runtimeEnv();
    return dispatch => {
        return fetch(`${env.REACT_APP_API_URL}/signup`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
            mode: 'cors'})
            .then( (response) => {
                if (!response.ok) {
                    alert("That username is unavailable. Please choose another.");
                    throw Error(response.statusText);
                }
                return response.json();
            })
            .then( () => {

                dispatch(submitLogin(data));
            })
            .catch( (e) => console.log(e) );
    }
}

export function logoutUser() {
    return dispatch => {
        localStorage.removeItem('username');
        localStorage.removeItem('token');
        dispatch(logout());
    }
}
