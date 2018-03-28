import { ipcRenderer } from 'electron';

export default function replayActionRenderer(processName) {
  return function(store) {
    ipcRenderer.on('redux-action', (event, payload) => {
      if (!payload.meta || payload.meta.originProcessId !== processName) {
        store.dispatch(payload);
      } else {
        console.log('local action detected do not redispatch', payload);
      }
    });
  };
}
