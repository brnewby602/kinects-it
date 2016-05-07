import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions/actions';
import FontIcon from 'material-ui/FontIcon';
import FlatButton from 'material-ui/FlatButton';


export const SignupPage = () => (
  <div>
    <h2>Create an Account with Kinects.It!</h2>
    <FlatButton
      label="Sign Up With Coinbase"
      backgroundColor="#2b71b1"
      hoverColor="#18355C"
      linkButton
      href="/api/v1/users/signup"
      style={{ color: 'white' }}
      secondary
      icon={<FontIcon className="material-icons">arrow_right</FontIcon>}
    />
  </div>
);

SignupPage.propTypes = {
  actions: PropTypes.object.isRequired,
  appState: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    appState: state.appState,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SignupPage);

