import React from 'react'
import BasePage from '../BasePage'
import BaseLayout from '../layouts/BaseLayout'

const namespace = "http://localhost:3000"

export default (role) => (
    (Component) => {
        return class withAuth extends React.Component {
    
            static getInitialProps = async (args) => {
                const pageProps = await Component.getInitialProps && await Component.getInitialProps(args)
    
                return { ...pageProps };
            }
    
            renderProtectPage = () => {
                const { isAuthenticated, user } = this.props.auth
                const userRole = user && user[`${namespace}/role`]
    
                let isAuthorized = false

                if (role) {
                    if (userRole === role) {
                        isAuthorized = true
                    } 
                } else {
                    isAuthorized = true
                }
    
                if (!isAuthenticated) {
                    return (
                        <BaseLayout {...this.props.auth}>
                            <BasePage >
                                <h1> You are not allow, please loggin to access this page </h1>
                            </BasePage>
                        </BaseLayout>
                    )
                } else if (isAuthenticated && !isAuthorized) {
                    return (
                        <BaseLayout {...this.props.auth}>
                            <BasePage >
                                <h1> You permission is denied </h1>
                            </BasePage>
                        </BaseLayout>
                    )
                } else {
                    return (<Component {...this.props} />)
                }
            }
    
            render(){
                return this.renderProtectPage()
            }
        }
    }
)




