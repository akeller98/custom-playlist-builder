import React, { useState } from 'react';
import './App.css';
import MetricSlider from './components/MetricSlider';

function App() {
  const [metricValue1, setMetricValue1] = React.useState(0)
  function handleChange(newMetricValue1: number) {
    setMetricValue1(newMetricValue1);
  }
  return (
    <div className="App">
      <header className="App-header">
        <div className="metrics-panel">
          <MetricSlider 
            name={String(metricValue1)}
            onChange={handleChange}
            />
          <MetricSlider 
            name="Metric 2"
            onChange={handleChange}
           />
          <MetricSlider 
            name="Metric 3"
            onChange={handleChange}
            />
        </div>
      </header>
    </div>
  );
}

export default App;
