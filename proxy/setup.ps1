# Setup script for the proxy server

if ($PSScriptRoot) {
	$SCRIPT_DIR = $PSScriptRoot
} else {
	$SCRIPT_DIR = Split-Path -Path $MyInvocation.MyCommand.Definition -Parent
}

# create virtual environment in the script directory
python -m venv "$SCRIPT_DIR\env"

# activate the venv for the current PowerShell session
. "$SCRIPT_DIR\env\Scripts\Activate.ps1"

# install requirements from the script directory
pip install -r "$SCRIPT_DIR\requirements.txt"
