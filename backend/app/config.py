import os
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "")

JWT_SECRET = os.getenv("JWT_SECRET", "dev-secret-change-me")
JWT_ALGORITHM = "HS256"
JWT_EXPIRE_MINUTES = int(os.getenv("JWT_EXPIRE_MINUTES", "1440"))

# Origins always allowed, in addition to whatever CORS_ORIGINS provides.
# The deployed frontend must work even if the env var on the hosting service
# is stale (Render dashboard edits are easy to forget after a new deploy).
KNOWN_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://green-comply-coral.vercel.app",
]

CORS_ORIGINS = list(dict.fromkeys(
    KNOWN_ORIGINS + [
        o.strip() for o in os.getenv("CORS_ORIGINS", "").split(",") if o.strip()
    ]
))

# True once real Supabase credentials are supplied. Until then, the API
# serves realistic seeded demo data from memory so the product can be
# demoed end-to-end with zero external setup.
SUPABASE_CONFIGURED = bool(SUPABASE_URL and SUPABASE_KEY)
