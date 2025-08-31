import React, { useState } from 'react';
import { EXAMPLES } from '../utils/clyp-highlighter';

const CodeExamples: React.FC = () => {
  const [activeTab, setActiveTab] = useState('basic');

  const tabs = [
    { id: 'basic', label: 'Basic Syntax', example: EXAMPLES.hello_world, filename: 'hello_world.clyp' },
    { id: 'structures', label: 'Data Structures', example: EXAMPLES.data_structures, filename: 'data_structures.clyp' },
    { id: 'advanced', label: 'Advanced', example: EXAMPLES.advanced, filename: 'advanced_features.clyp' }
  ];

  const currentTab = tabs.find(tab => tab.id === activeTab) || tabs[0];

  return (
    <section className="code-examples">
      <div className="examples-container">
        <h2 className="section-title">See Clyp in Action</h2>
        <div className="examples-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        
        <div className="tab-content active">
          <div className="code-example">
            <div className="example-header">
              <h3>{currentTab.example.title}</h3>
              <p>{currentTab.example.description}</p>
            </div>
            <div className="code-window">
              <div className="code-header">
                <div className="code-dots">
                  <span className="dot red"></span>
                  <span className="dot yellow"></span>
                  <span className="dot green"></span>
                </div>
                <span className="code-title">{currentTab.filename}</span>
              </div>
              <div 
                className="code-content"
                dangerouslySetInnerHTML={{ __html: currentTab.example.highlighted_code || '' }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CodeExamples;