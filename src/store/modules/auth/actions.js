import axios from "axios";
import router from '../../../router.js';
export default {
    async login(context, payload) {

        await axios.post('http://localhost:3000/login', {
            'email': payload.email,
            'password': payload.password
        }).then(response => {
            localStorage.setItem('accessToken', response.data.access_token);
            context.commit('setUser', {
                user: response.data.user,
                isLoggedIn: true
            });
            router.push('/transfers');
        })
            .catch(e => {
                const error = new Error(e || 'Failed to authenticate. Check your login data.');
                throw error;
            })
    }
}