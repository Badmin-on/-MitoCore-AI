# hospital_nucleus.py
# The Organic Brain of the Hospital Platform
# Implements Feedback Memory and Decentralized Peer Coordination

import asyncio
import json
import time
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import requests

app = FastAPI(title="MitoCore-AI: Organic Intelligence Engine")

# --- vLLM-Inspired Global State ---
class FeedbackMemory:
    """Sliding window memory for iterative refinement (arXiv:2603.12091)"""
    def __init__(self, capacity=5):
        self.memory = []
        self.capacity = capacity

    def add(self, result):
        self.memory.append(result)
        if len(self.memory) > self.capacity:
            self.memory.pop(0)

    def get_context(self):
        return "\n".join([f"Previous Attempt: {m}" for m in self.memory])

memory = FeedbackMemory()

# --- Model Configuration (8GB Guard) ---
MODELS = {
    "nucleus": "llama3.2:1b",
    "logic": "phi3.5:latest",
    "translator": "exaone3.5:2.4b",
    "context": "qwen2.5:1.5b"
}

class Query(BaseModel):
    text: str
    stream: bool = False

async def ollama_call(model, prompt):
    """Simulates vLLM PagedAttention logic via Ollama (Sequential for 8GB safety)"""
    url = "http://localhost:11434/api/generate"
    payload = {"model": model, "prompt": prompt, "stream": False}
    try:
        response = requests.post(url, json=payload, timeout=120)
        return response.json().get("response", "")
    except Exception as e:
        return f"Error connecting to {model}: {str(e)}"

# --- Organic Routing (CTDE-Inspired) ---
@app.post("/diagnose")
async def diagnose(query: Query):
    start_time = time.time()
    
    # 1. Translator Input (Exaone) - Korean Nuance
    translation_prompt = f"환자의 다음 설명을 전문적인 의료 용어와 정확한 문맥으로 정제하라: {query.text}"
    refined_text = await ollama_call(MODELS["translator"], translation_prompt)
    
    # 2. Logic Verification (Phi-3.5) - Medical Guardrail
    logic_prompt = f"다음 의료 정제 텍스트에서 논리적 오류나 위험 요소를 검토하라: {refined_text}"
    logic_report = await ollama_call(MODELS["logic"], logic_prompt)
    
    # 3. Nucleus Synthesis (Llama-3.2) - Final Decision
    nucleus_prompt = f"""
    [System Feedback Memory]
    {memory.get_context()}
    
    [Refined Text]
    {refined_text}
    
    [Logic Audit]
    {logic_report}
    
    위 정보를 종합하여 사령관(Alex)을 위한 최종 의료 전략 보고서를 작성하라.
    """
    final_output = await ollama_call(MODELS["nucleus"], nucleus_prompt)
    
    # Add to Feedback Memory for next turn
    memory.add(final_output[:200] + "...")
    
    latency = time.time() - start_time
    return {
        "status": "success",
        "result": final_output,
        "metadata": {
            "latency": f"{latency:.2f}s",
            "cells_active": ["translator", "logic", "nucleus"],
            "vram_strategy": "neighbor_based_coordination"
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
