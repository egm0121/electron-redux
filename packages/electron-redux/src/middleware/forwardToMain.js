import { ipcRenderer } from 'electron';
import validateAction from '../helpers/validateAction';

const forwardToMain = processName => store => next => (action) => {
  //eslint-disable-line

  if (!validateAction(action)) return next(action);

  if (
    action.type.substr(0, 2) !== '@@' &&
    action.type.substr(0, 10) !== 'redux-form' &&
    (!action.meta || !action.meta.scope || action.meta.scope !== 'local')
  ) {
    const prevMeta = action.meta || {};
    const remoteAction = {
      ...action,
      meta: {
        ...prevMeta,
        originProcessId: processName,
      },
    };
    ipcRenderer.send('redux-action', remoteAction);
    // stop action in-flight
    // eslint-disable-next-line consistent-return
  }

  // eslint-disable-next-line consistent-return
  return next(action);
};

export default forwardToMain;
