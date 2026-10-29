import os
from dotenv import load_dotenv

load_dotenv()

import sys
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.services.rag_service import ChatbotService

try:
    bot = ChatbotService()
    print("Init success!")
    ans = bot.get_response("Halo")
    print("Ans:", ans)
except Exception as e:
    import traceback
    traceback.print_exc()
