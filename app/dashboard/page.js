"use client"
import { useEffect, useState } from 'react';
import { ActivityChart } from '../components/ActivityChart';

export default function Dashboard() {
  const [agents, setAgents] = useState([]);

  // Fetch data dari C2
  useEffect(() => {
    const fetchData = () => {
      fetch('http://localhost:8000/agents')
        .then(res => res.json())
        .then(data => setAgents(data));
    };
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">BreachLab Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <ActivityChart />
          <div className="md:col-span-2 bg-white p-6 rounded-xl border shadow-sm">
            <h2 className="text-sm font-semibold text-gray-400 uppercase mb-4">Active Agents</h2>
            <div className="space-y-4">
              {agents.map((agent: any) => (
                <div key={agent.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-mono font-bold text-gray-800">{agent.hostname}</p>
                    <p className="text-xs text-gray-500">Logs captured: {agent._count.logs}</p>
                  </div>
                  <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}