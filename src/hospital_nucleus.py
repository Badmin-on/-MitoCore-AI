import asyncio
import json
import time
import logging
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests
from profiler import HardwareProfiler

# @service[MitoCoreNucleus] layer:BACKEND
app = FastAPI(title="MitoCore-AI: Organic Intelligence Engine")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class Query(BaseModel):
    text: str

class SystemState:
    def __init__(self):
        self.profile = HardwareProfiler.get_hardware_profile()
        self.active_models = HardwareProfiler.get_optimal_models(self.profile["tier"])
        self.is_custom = False

state = SystemState()

# @fn[ollama_call]
async def ollama_call(model, prompt):
    try:
        response = requests.post(
            "http://localhost:11434/api/generate",
            json={"model": model, "prompt": prompt, "stream": False},
            timeout=30
        )
        return response.json().get("response", "No response content.")
    except Exception as e:
        return f"Error connecting to {model}: {str(e)}"

@app.get("/status")
async def get_status():
    return {
        "profile": state.profile,
        "models": state.active_models,
        "is_custom": state.is_custom
    }

@app.post("/config/models")
async def update_models(new_models: dict):
    state.active_models.update(new_models)
    state.is_custom = True
    return {"status": "success", "active_models": state.active_models}

@app.post("/diagnose")
async def diagnose(query: Query):
    start_time = time.time()
    models = state.active_models
    
    # 1. Translator Input (Exaone)
    t_prompt = f"환자의 다음 설명을 전문적인 의료 용어와 정확한 문맥으로 정제하라: {query.text}"
    refined_text = await ollama_call(models.get("Matrix", "exaone3.5:2.4b"), t_prompt)
    
    # 2. Logic Verification (Phi-3.5)
    l_prompt = f"다음 의료 정제 텍스트에서 논리적 오류나 위험 요소를 검토하라: {refined_text}"
    logic_report = await ollama_call(models.get("Synth", "phi3.5:latest"), l_prompt)
    
    # 3. Nucleus Synthesis (Llama-3.2)
    n_prompt = f"의료 정제 텍스트 {refined_text}와 논리 검토 {logic_report}를 바탕으로 최종 조언을 작성하라."
    final_advisory = await ollama_call(models.get("Cortex", "llama3.2:1b"), n_prompt)
    
    latency = round(time.time() - start_time, 2)
    
    return {
        "result": final_advisory,
        "metadata": {
            "latency": f"{latency}s",
            "tier": state.profile["tier"],
            "models_used": models
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
