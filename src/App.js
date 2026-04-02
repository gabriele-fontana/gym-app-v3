// App.js — Root component. Sets up react-router-dom v6 routes and wraps
// the app in global context providers (WorkoutContext, ProgressContext).
// The Layout component renders the Sidebar + Header shell around page content.

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import EditPlans from './pages/EditPlans';
import Workout from './pages/Workout';
import Calendar from './pages/Calendar';
import Profile from './pages/Profile';
import { WorkoutProvider } from './context/WorkoutContext';
import { ProgressProvider } from './context/ProgressContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';

function App() {
  return (
    <WorkoutProvider>
      <ProgressProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Navigate to="/plans" replace />} />
              <Route path="/plans" element={<EditPlans />} />
              <Route path="/workout" element={<Workout />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </Layout>
        </Router>
      </ProgressProvider>
    </WorkoutProvider>
  );
}

export default App;
