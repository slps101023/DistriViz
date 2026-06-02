from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
import asyncio
import json
import random

app = FastAPI()

# 允許跨域請求 (CORS)，這樣 Next.js 才能順利連線
# todo : 在生產環境中，建議將 allow_origins 設定為你的前端 URL，而不是 "*"
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.websocket("/ws/simulation")
async def simulation_endpoint(websocket: WebSocket):
    await websocket.accept()
    print("✅ 前端已連線至 Python 模擬引擎！")
    
    try:
        makespan = 0
        while True:
            makespan += 1
            
            # 這裡打包你物件化模型的狀態 (目前先用亂數模擬動態效果)
            state_data = {
                "makespan": makespan,
                "throughput": random.randint(40, 60),
                "nodes": [
                    {"id": "Node-1", "cpu_percent": random.randint(30, 80)},
                    {"id": "Node-2", "cpu_percent": random.randint(10, 50)},
                    {"id": "Node-3", "cpu_percent": random.randint(60, 95)},
                ],
                "pending_tasks": random.randint(0, 5)
            }
            
            # 轉成 JSON 傳給前端
            await websocket.send_text(json.dumps(state_data))
            
            # 控制模擬速度（每 1 秒推送一次狀態）
            await asyncio.sleep(1)
            
    except Exception as e:
        print(f"❌ 連線中斷: {e}")