// src/App.jsx
import React from 'react';
import ControlPanel from './components/ControlPanel';
import MediaViewer from './components/MediaViewer';
import Notification from './components/Notification';
import { AppProvider } from './context/AppContext';

function App() {
  return (
    <AppProvider>
      <div className="flex flex-row justify-center items-start min-h-screen bg-gray-100 font-sans p-4">
        <ControlPanel />
        <MediaViewer />
      </div>
      <Notification />
    </AppProvider>
  );
}

export default App;
