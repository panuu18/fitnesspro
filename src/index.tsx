// Install Expo global polyfill for Web/Vite environments
if (typeof globalThis !== 'undefined' && !(globalThis as any).expo) {
  class MockNativeModule {}
  class MockEventEmitter {
    addListener() { return { remove: () => {} }; }
    removeListener() {}
    emit() {}
  }
  (globalThis as any).expo = {
    NativeModule: MockNativeModule,
    SharedObject: class {},
    SharedRef: class {},
    EventEmitter: MockEventEmitter,
    modules: {},
    uuidv4: () => Math.random().toString(36).substring(2),
    uuidv5: () => Math.random().toString(36).substring(2),
    getViewConfig: () => ({}),
    reloadAppAsync: async () => window.location.reload(),
  };
}

import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
