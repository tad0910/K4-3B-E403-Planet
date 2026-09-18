import sys
from pathlib import Path

# Thêm thư mục gốc của repository vào sys.path để import được codebase
ROOT_DIR = Path(__file__).resolve().parent.parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

from codebase.api import app

# Vercel Serverless Python entrypoint
