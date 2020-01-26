import auth0 from 'auth0-js'
import Cookie from 'js-cookie'
import jwt from 'jsonwebtoken'
import axios from 'axios'

import { getCookieFromReq } from '../helper/util'

class Auth {
    
    constructor(){
        this.auth0 = new auth0.WebAuth({
            domain: 'dev-pw9ozuy2.auth0.com',
            clientID: '2hzks5HaSDt0p5OVet8YMYAgIt6w3lwq',
            redirectUri: 'http://localhost:3000/callback',
            responseType: 'token id_token',
            scope: 'openid profile'
        })
    }

    login = () => {
        this.auth0.authorize();
    }

    handleAuthentication = () => {
        return new Promise((resolve, reject)=>{

            this.auth0.parseHash((err, authResult) => {
                if (authResult && authResult.accessToken && authResult.idToken) {
                    resolve();
                    this.setSession(authResult);
                } else if (err) {
                    reject(err);
                }
            })
            
        })
    }

    setSession = (authResult) => {
        const expiresAt = JSON.stringify(authResult.expiresIn * 1000) + new Date().getTime();
        Cookie.set('user', authResult.idTokenPayload)
        Cookie.set('jwt', authResult.idToken)
        Cookie.set('expiresAt', expiresAt)
    }

    logout = () => {
        Cookie.remove('user')
        Cookie.remove('jwt')
        Cookie.remove('expiresAt')

        this.auth0.logout({
            returnTo: '',
            clientID: '2hzks5HaSDt0p5OVet8YMYAgIt6w3lwq'
        })
    }

    serverAuth = async (req) => {
        if (req.headers.cookie) {
            const token = getCookieFromReq(req, 'jwt')
            const verifiedToken = await this.verfifyToken(token)
            return verifiedToken
        }
    }

    verfifyToken = async (token) => {
        if(token){
            const deCodedToken = jwt.decode(token, {complete: true})
            if(!deCodedToken){return undefined}
            const jwks = await this.getJSWKS()
            const jwk = jwks.keys[0]

            let cert = jwk.x5c[0]
            cert = cert.match(/.{1,64}/g).join('\n')
            cert = `-----BEGIN CERTIFICATE-----\n${cert}\n-----END CERTIFICATE-----\n`

            if(jwk.kid === deCodedToken.header.kid) {
                try {
                    const verifiedToken = jwt.verify(token, cert)
                    const expiresAt = verifiedToken.exp * 1000
                    return verifiedToken && new Date().getTime() < expiresAt ? verifiedToken : undefined
                } catch(err) {
                    return undefined
                }
            }
        }
    }

    clientAuth = async () => {
        const token = Cookie.getJSON('jwt');
        const verifiedToken = await this.verfifyToken(token);
        return  verifiedToken
    }

    getJSWKS = async () => {
        const resp = await axios.get('https://dev-pw9ozuy2.auth0.com/.well-known/jwks.json')
        const jwks = resp.data
        return jwks
    }
}

const auth0Client = new Auth();

export default auth0Client;


