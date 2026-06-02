"use client"; // 告訴 Next.js 這是客戶端渲染組件，才能使用 WebSocket 和 State

import { useEffect, useState } from 'react';

// 定義從後端接收到的資料結構類型
interface SimState {
  makespan: number;
  throughput: number;
  pending_tasks: number;
  nodes: Array<{ id: string; cpu_percent: number }>;
}

export default function Home() {
  // 初始化狀態
  const [simState, setSimState] = useState<SimState>({
    makespan: 0,
    throughput: 0,
    pending_tasks: 0,
    nodes: []
  });

  const [wsStatus, setWsStatus] = useState("Disconnected 🔴");

  useEffect(() => {
    // 連線到後端的 FastAPI WebSocket 路由
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000/ws/simulation";
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      setWsStatus("Connected 🟢");
      console.log("✅ 成功連線至 FastAPI 模擬引擎");
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setSimState(data);
      } catch (err) {
        console.error("解析後端資料失敗:", err);
      }
    };

    ws.onclose = () => {
      setWsStatus("Disconnected 🔴");
      console.log("❌ 與後端連線中斷");
    };

    // 組件卸載時自動關閉連線，避免記憶體殘留
    return () => {
      ws.close();
    };
  }, []);

  return (
    <div className="bg-gray-900 text-white min-h-screen p-8 font-sans">
      {/* 標題與連線狀態 */}
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-blue-400">CloudSched Sandbox</h1>
          <p className="text-gray-400 text-sm mt-1">Kubernetes 叢集排程模擬引擎</p>
        </div>
        <div className="bg-gray-800 px-4 py-2 rounded-full text-sm border border-gray-700">
          後端狀態: <span className="font-semibold">{wsStatus}</span>
        </div>
      </header>

      {/* KPI 指標卡片區 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
          <h3 className="text-gray-400 text-xs uppercase tracking-wider">系統完工時間 (Makespan)</h3>
          <p className="text-3xl font-bold mt-2">{simState.makespan} <span className="text-sm font-normal text-gray-400">秒</span></p>
        </div>
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
          <h3 className="text-gray-400 text-xs uppercase tracking-wider">當前吞吐量 (Throughput)</h3>
          <p className="text-3xl font-bold mt-2 text-green-400">{simState.throughput} <span className="text-sm font-normal text-gray-400">Pods/s</span></p>
        </div>
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
          <h3 className="text-gray-400 text-xs uppercase tracking-wider">佇列中待辦 Pods</h3>
          <p className="text-3xl font-bold mt-2 text-yellow-500">{simState.pending_tasks} <span className="text-sm font-normal text-gray-400">個任務</span></p>
        </div>
      </div>

      {/* K8s 實體節點負載區 */}
      <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
        <h2 className="text-xl font-bold mb-6 text-gray-200 flex items-center gap-2">
          <span>🖥️</span> Cluster Nodes 即時資源水位監控
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {simState.nodes.map((node) => (
            <div key={node.id} className="bg-gray-700/50 p-5 rounded-lg border border-gray-600">
              <div className="flex justify-between items-center mb-3">
                <span className="font-bold text-gray-200">{node.id}</span>
                <span className={`text-sm font-semibold ${node.cpu_percent > 80 ? 'text-red-400' : 'text-green-400'}`}>
                  {node.cpu_percent}% CPU
                </span>
              </div>
              
              {/* 進度條外框 */}
              <div className="w-full bg-gray-800 rounded-full h-4 overflow-hidden">
                {/* 動態填滿條 */}
                <div 
                  className={`h-full rounded-full transition-all duration-700 ease-out ${
                    node.cpu_percent > 80 ? 'bg-gradient-to-r from-orange-500 to-red-500' : 'bg-gradient-to-r from-emerald-500 to-green-400'
                  }`} 
                  style={{ width: `${node.cpu_percent}%` }}
                ></div>
              </div>
            </div>
          ))}

          {simState.nodes.length === 0 && (
            <div className="col-span-3 text-center text-gray-500 py-8">
              等待後端推播叢集節點資料...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}