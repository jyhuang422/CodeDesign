import React from 'react'
import { connect } from 'react-redux'
import Header from 'components/Header'
import Index from 'components/Index'
import Aboutme from 'components/Aboutme'

const app = ({current, children}) => (
  <div>
      Current Page: {current}
      <Header styles={current === '/' ? {display: 'none'} : {display: 'block'} } />
      {children}
  </div>
)

const mapStateToProps = (state, ownProps) => {
    const current = ownProps.location ? ownProps.location.pathname : '/';
    return {
        current: current
    }
}

const App = connect(
  mapStateToProps,
)(app);

export default App