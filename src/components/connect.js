import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as Actions from '../actions';

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch)
  };
}

export default function(mapStateToProps, component) {
  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(component);
}
