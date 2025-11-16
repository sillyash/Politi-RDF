#!/bin/bash
# Setup script for the proxy server

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

python -m venv env
source env/bin/activate
pip install -r requirements.txt
