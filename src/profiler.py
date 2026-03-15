import psutil
import subprocess
import json
import logging

# @service[HardwareProfiler] layer:BACKEND
class HardwareProfiler:
    # @fn[get_hardware_profile]
    # @returns: dict (cpu_cores, total_ram, gpu_name, vram_total, vram_free)
    @staticmethod
    def get_hardware_profile():
        profile = {
            "cpu_cores": psutil.cpu_count(logical=True),
            "total_ram_gb": round(float(psutil.virtual_memory().total) / (1024**3), 2),
            "gpu_name": "Generic CPU",
            "vram_total_gb": 0.0,
            "vram_free_gb": 0.0,
            "tier": "Survivor"
        }

        try:
            # Try to get NVIDIA GPU info via nvidia-smi
            result = subprocess.check_output(
                ["nvidia-smi", "--query-gpu=gpu_name,memory.total,memory.free", "--format=csv,noheader,nounits"],
                encoding='utf-8',
                timeout=5
            )
            name, total, free = result.strip().split(',')
            profile["gpu_name"] = name.strip()
            profile["vram_total_gb"] = round(float(total) / 1024, 2)
            profile["vram_free_gb"] = round(float(free) / 1024, 2)
        except Exception as e:
            logging.warning(f"NVIDIA GPU detection failed: {e}. Falling back to CPU/Generic.")

        # @logic: Intelligence Tiering
        vram = profile["vram_total_gb"]
        if vram >= 11.0:
            profile["tier"] = "Ultra"
        elif vram >= 7.0:
            profile["tier"] = "Edge"
        else:
            profile["tier"] = "Survivor"

        return profile

    # @fn[get_optimal_models]
    # @params: [tier: str]
    # @returns: dict (matrix, synth, cortex, echo)
    @staticmethod
    def get_optimal_models(tier):
        suites = {
            "Ultra": {
                "Matrix": "exaone3.5:7.8b",
                "Synth": "phi3.5:latest",
                "Cortex": "llama3:8b",
                "Echo": "qwen2.5:7b"
            },
            "Edge": {
                "Matrix": "exaone3.5:2.4b",
                "Synth": "phi3.5:latest",
                "Cortex": "llama3.2:3b",
                "Echo": "qwen2.5:1.5b"
            },
            "Survivor": {
                "Matrix": "exaone3.5:2.4b",
                "Synth": "phi3.5:mini",
                "Cortex": "llama3.2:1b",
                "Echo": "qwen2.5:1.5b"
            }
        }
        return suites.get(tier, suites["Survivor"])

if __name__ == "__main__":
    print(json.dumps(HardwareProfiler.get_hardware_profile(), indent=2))
