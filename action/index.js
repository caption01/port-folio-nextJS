import axios from 'axios'
import Cookie from 'js-cookie'
import { getCookieFromReq } from '../helper/util'

const setAuthHeader = (req) => {
    const token = req ? getCookieFromReq(req, 'jwt') : Cookie.getJSON('jwt')
    if (token) {
        return {
            headers: {
                'authorization': `Bearer ${token}`
            }
        }
    }
    return undefined
}

export const getSecreatData = async (req) => {

    const url = 'http://localhost:3000/api/v1/secreat'

    return await axios.get(url, setAuthHeader()).then(resp => resp.data)
    
}
