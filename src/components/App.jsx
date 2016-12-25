import React from 'react'
import { connect } from 'react-redux'
import Header from 'components/Header'
import Index from 'components/Index'
import Aboutme from 'components/Aboutme'

const app = ({current}) => (
  <div>
      Current Page: {current}
      <Header />
      <Index />
      <Aboutme />
  </div>
)

const mapStateToProps = (state) => {
    return {
        current: state.page.current
    }
}

const App = connect(
  mapStateToProps,
)(app);

export default App