# Learn FastAPI

## 🚀 Basics

### Install FastAPI and Uvicorn
```bash
pip install fastapi uvicorn
```

### Hello World
```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"Hello": "FastAPI"}
```

### Run Server
```bash
uvicorn main:app --reload
```

## 🧱 Intermediate

### Path Parameters
```python
@app.get("/items/{item_id}")
def read_item(item_id: int):
    return {"item_id": item_id}
```

### Request Body with Pydantic
```python
from pydantic import BaseModel

class Item(BaseModel):
    name: str
    price: float

@app.post("/items/")
def create_item(item: Item):
    return item
```

## 🧠 Advanced

### Dependency Injection
```python
from fastapi import Depends

def common_params(q: str = None):
    return {"q": q}

@app.get("/search/")
def search(params: dict = Depends(common_params)):
    return params
```

### Custom Exception Handler
```python
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from fastapi import Request

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=400,
        content={"detail": exc.errors()},
    )
```

