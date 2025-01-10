# ai-serve

## Project Overview

`ai-serve` is a modular and extensible LLM service designed for integrating multiple language models (e.g., OpenAI, Claude) into applications like InkyAI. The service operates as a headless backend with RESTful and WebSocket interfaces.

## Features

- **Model Abstraction Layer:** Integrate and switch between different language models with a flexible layer.
- **API Endpoints:** Expose RESTful and WebSocket APIs for frontend communication.
- **Alias Management:** Define and switch between aliases for LLMs dynamically.
- **Logging and Monitoring:** Robust logging and monitoring capabilities for debugging and performance tracking.
- **Proton HTML5 UI Integration:** Seamless integration with Proton-based frontend UIs.

## Installation

1. Ensure you have [Deno](https://deno.land/) installed.
2. Clone the repository:
   ```bash
   git clone <repository-url>
   cd ai-serve
   ```
3. Install dependencies using the import map:
   ```bash
   deno cache src/deps.ts
   ```

## Usage

Run the service with the following command:
```bash
deno run --allow-net --allow-read --env --watch --import-map import_map.json src/main.ts
```

## Terminal UI Usage

Interact with the service using terminal commands:

1. **Using `curl` for RESTful API:**
   - To send a prompt to the service, use:
     ```bash
     curl -X POST http://localhost:8000/api/v1/chat -H "Content-Type: application/json" -d '{"prompt": "Hello, how are you?"}'
     ```

2. **Using a WebSocket client:**
   - Connect to the WebSocket endpoint with:
     ```bash
     wscat -c ws://localhost:8000/api/v1/chat/stream
     ```

## Configuration

- **`config.json`:** Configuration file for alias definitions and other settings.

## Testing

Run tests using Deno's built-in test runner:
```bash
deno test
```

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any improvements or bug fixes.
