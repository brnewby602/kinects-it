import React, { PropTypes } from 'react';
import { DeviceChart } from '../components/DeviceChart';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions/actions';
import FlatButton from 'material-ui/FlatButton';
import Subheader from 'material-ui/Subheader';
import Paper from 'material-ui/Paper';
import styles from '../assets/formStyles';
import Formsy from 'formsy-react';
import { FormsyText, FormsyRadioGroup, FormsyRadio } from 'formsy-material-ui/lib';
import CircularProgress from 'material-ui/CircularProgress';
import { FormMessageDialogue } from '../components/FormMessageDialogue';
import $ from 'jquery';
import moment from 'moment';

export class DevicePage extends React.Component {

  constructor(props) {
    super(props);
    this.errorMessages = {
      nameError: 'Please provide a valid name',
      unitsError: 'Please enter valid units',
      priceError: 'Please enter time and price options',
    };
    this.state = {
      deviceActive: false,
      canSubmit: true,
      error: '',
      totalCost: 0,
      time: 0,
      units: 0,
      deviceTransactions: [],
      spinner: false,
    };
  }

  componentDidMount() {
    const homeId = this.props.appState.house.id;
    const deviceId = this.props.appState.featured.id;
    const user = { user: this.props.authState.user.id };

    const apiPath = '/api/v1/homes/'.concat(homeId).concat('/devices/').concat(deviceId);
    $.get(apiPath, user, (res) => {
      if (res.success === false) {
        this.openErrorMessage();
        this.setState({
          error: 'Error retrieving device info',
          details: res.message,
        });
      }
      this.setState({
        deviceTransactions: res.data,
      });
    })
    .fail((/* error */) => {
      this.openErrorMessage();
      this.setState({
        error: 'Error retrieving device info',
        details: 'There was an error retrieving the device information. Please try again.',
      });
    });
  }

  openErrorMessage() {
    this.messageDialogue.handleOpen();
  }

  totalCost(time, units) {
    const costPerMs = this.props.appState.featured.usagecostoptions / 3600000;
    return (units * time * costPerMs).toFixed(2);
  }

  handleTime(e) {
    const time = parseInt(e.target.value, 10);
    const totalCost = this.totalCost(time, this.state.units);

    this.setState({
      time,
      totalCost,
    });
  }

  handleUnits(e) {
    const units = parseInt(e.target.value, 10);
    const totalCost = this.totalCost(this.state.time, units);

    this.setState({
      units,
      totalCost,
    });
  }

  enableButton() {
    this.setState({
      canSubmit: true,
    });
  }

  disableButton() {
    this.setState({
      canSubmit: false,
    });
  }

  toggleDevice(deviceState) {
    const hardwarekey = this.props.appState.featured.hardwarekey;
    const apiPath = '/api/v1/homes/1/devices/'.concat(hardwarekey);

    this.setState({ spinner: true });

    $.post(apiPath, deviceState, (res) => {
      if (!res.success) {
        this.setState({
          error: res.message,
          details: 'Failed to activate device, please try again',
        });
        this.openErrorMessage();
      } else {
        this.props.actions.toggleDevice(true);
        this.props.actions.paidUsage(true);
        const updatedTransactions = this.state.deviceTransactions.concat(res.transactionData);
        const currentTime = Date.now();
        const expirationTime = currentTime + res.transactionData.timespent;
        const expiration = moment(expirationTime).calendar().toLowerCase();
        this.setState({
          deviceActive: true,
          updatedTransactions,
          expiration,
        });
      }
    })
    .fail(() => {
      // set local state to display error
      this.setState({
        error: 'Communication error',
        details: 'Failed to connect to device, please try again',
      });
      this.openErrorMessage();
    })
    .always(() => {
      this.setState({ spinner: false });
    });
  }

  submitForm(data) {
    const totalTime = data.time * data.units;
    const deviceState = this.props.appState.featured;
    deviceState.payaccountid = this.props.appState.payAccounts[0].id; // first payment option
    deviceState.timespent = totalTime;
    deviceState.amountspent = this.totalCost(data.time, data.units);
    deviceState.paidusage = true;
    deviceState.isactive = true;
    deviceState.deviceid = this.props.appState.featured.id;

    this.toggleDevice(deviceState);
  }

  notifyFormError(data) {
    console.error('Form error:', data);
  }

  render() {
    let spinner = this.state.spinner ?
      <div className="loading"><CircularProgress size={2} /></div> : '';

    if (this.props.appState.featured.id === '') {
      return (
        <div style={styles.center}>
          <h2>Uh oh!</h2>
          <p>You need to choose a device to display.</p>
          <p>Click <a href="/dashboard">here</a> to return to your dashboard.</p>
        </div>
      );
    }

    let formDisplay = <h2>This device is currently active!</h2>;

    if (!this.props.appState.featured.isactive) {
      formDisplay = (
        <Paper style={styles.paperStyle}>
          <Formsy.Form
            onValid={() => this.enableButton()}
            onValidSubmit={(data) => this.submitForm(data)}
            onInvalidSubmit={() => this.notifyFormError()}
          >
            <FormsyRadioGroup
              name="time" defaultSelected="60000" onChange={(e) => this.handleTime(e)}
            >
              <FormsyRadio
                value="60000"
                label="1 minute"
              />
              <FormsyRadio
                value="3600000"
                label="1 hour"
              />
              <FormsyRadio
                value="86400000"
                label="1 day"
              />
            </FormsyRadioGroup>
            <FormsyText
              name="units"
              validations="isInt"
              validationError={this.errorMessages.unitsError}
              required
              style={styles.fieldStyles}
              onChange={(e) => this.handleUnits(e)}
              floatingLabelText="How many units do you want?"
            />
            <div style={styles.center}>
              <FlatButton
                style={styles.submitStyle}
                type="submit"
                label="Submit"
                disabled={!this.state.canSubmit}
              />
            </div>
          </Formsy.Form>
          <Subheader>
            <p>Total cost: {this.state.totalCost}</p>
          </Subheader>
        </Paper>
      );
    } else if (this.state.deviceActive === true) {
      formDisplay = (
        <h2>You enabled the device! Your time expires {this.state.expiration}.</h2>
      );
    }

    let chart = <div></div>;

    if (this.state.deviceTransactions.length > 0) {
      chart = <div><DeviceChart transactions={this.state.deviceTransactions} /></div>;
    }

    let newchart = <div></div>;

    if (this.state.updatedTransactions) {
      chart = <div></div>;
      newchart = <div><DeviceChart transactions={this.state.updatedTransactions} /></div>;
    }

    return (
      <div>
        <h2>How much time would you like to use the {this.props.appState.featured.name}?</h2>
        {spinner}
        <h3>This device is: {this.props.appState.featured.description}</h3>
        {formDisplay}
        {newchart}
        {chart}
        <FormMessageDialogue
          ref={(node) => { this.messageDialogue = node; }}
          title={this.state.error}
          failure
        >
          <p>{this.state.details}</p>
        </FormMessageDialogue>
      </div>
    );
  }
}


DevicePage.propTypes = {
  actions: PropTypes.object.isRequired,
  appState: PropTypes.object.isRequired,
  authState: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    appState: state.appState,
    authState: state.authState,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DevicePage);

