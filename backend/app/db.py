from functools import lru_cache

from app.config import SUPABASE_URL, SUPABASE_KEY, SUPABASE_CONFIGURED


@lru_cache
def get_supabase():
    """
    Returns a cached Supabase client, or None if SUPABASE_URL / SUPABASE_KEY
    are not set. Every router checks SUPABASE_CONFIGURED before calling this,
    and falls back to in-memory seeded data (app/mock_data.py) otherwise —
    so the API is fully functional for a demo without a live database.
    """
    if not SUPABASE_CONFIGURED:
        return None
    from supabase import create_client
    return create_client(SUPABASE_URL, SUPABASE_KEY)
