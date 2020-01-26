import React from 'react';
import BaseLayout from '../components/layouts/BaseLayout';
import BasePage from '../components/BasePage';
import { withRouter } from 'next/router'

import auth0Client from '../services/auth0';

class Callback extends React.Component {

    componentDidMount = async () => {
        await auth0Client.handleAuthentication()
        this.props.router.push('/')
    }

  render() {
    return (
      <BaseLayout {...this.props.auth} >
        <BasePage >
          <h1> Verifying Login data </h1>
        </BasePage>
      </BaseLayout>
    )
  }   
}

export default withRouter(Callback);
