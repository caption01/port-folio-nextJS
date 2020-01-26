import React from 'react';
import BaseLayout from '../components/layouts/BaseLayout';
import BasePage from '../components/BasePage';
import axios from 'axios';

import withAuth from '../components/hoc/withAuth'

import { getSecreatData } from '../action/index'

class Secreat extends React.Component {

    // static getInitialProps = async () => {

    //     return {  }
    // }

    constructor(props){
        super(props);
        this.state = {
            secreatData: []
        }
    }

    componentDidMount = async () => {
       const secreatData = await getSecreatData()

       this.setState({
           secreatData
       })
    }

    displaySecreatData = () => {
        const { secreatData } = this.state
        if (secreatData && secreatData.length) {
            return secreatData.map( (data, index) => {
                return (
                    <p key={index} >{data.title}</p>
                )
            })
        }

        return null
    }

    render() {

        const { superSecreatValue } = this.props
        
        return (
            <BaseLayout {...this.props.auth}>
                <BasePage >
                    <h1> I am Secreat Page </h1>
                    <h2>{superSecreatValue}</h2>
                    {
                        this.displaySecreatData()
                    }
                </BasePage>
            </BaseLayout>
        )
    }   
}

export default withAuth()(Secreat);
