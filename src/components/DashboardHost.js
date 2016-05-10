import React, { PropTypes } from 'react';
import { DeviceAddButton } from './DeviceAddButton';
import { DeviceList } from './DeviceList';

export const DashboardHost = (props) => (
  <div>
    <h1>Dashboard Host</h1>
    <DeviceAddButton />
    <DeviceList appState={props.appState} />
  </div>
);

DashboardHost.propTypes = {
  appState: PropTypes.object.isRequired,
};

