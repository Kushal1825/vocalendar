from fastapi import HTTPException, Header
import jwt
import httpx
from app.config import settings

CLERK_JWKS_URL = None

async def get_jwks():
    global CLERK_JWKS_URL
    # extract your clerk domain from the token issuer
    async with httpx.AsyncClient(timeout=10.0) as client:
        # get JWKS from Clerk
        issuer = "https://relaxed-crawdad-50.clerk.accounts.dev"  # your clerk domain
        response = await client.get(f"{issuer}/.well-known/jwks.json")
        return response.json()

async def get_current_user(authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid authorization header")

    token = authorization.split(" ")[1]

    try:
        # decode header to get kid
        header = jwt.get_unverified_header(token)
        
        # fetch JWKS
        jwks = await get_jwks()
        
        # find matching key
        public_key = None
        for key in jwks["keys"]:
            if key["kid"] == header["kid"]:
                public_key = jwt.algorithms.RSAAlgorithm.from_jwk(key)
                break

        if not public_key:
            raise HTTPException(status_code=401, detail="Public key not found")

        # verify and decode token
        payload = jwt.decode(
            token,
            public_key,
            algorithms=["RS256"],
            options={"verify_aud": False}
        )

        return {
            "user_id": payload.get("sub"),
            "email": payload.get("email", "")
        }

    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except Exception as e:
        print("JWT ERROR:", str(e))
        raise HTTPException(status_code=401, detail="Invalid token")