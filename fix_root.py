import os

filepath = 'backend/app/main.py'
if os.path.exists(filepath):
    with open(filepath, 'r') as f:
        content = f.read()
    
    root_route = """
@app.get("/", tags=["System"])
async def root():
    return {
        "message": "Welcome to VMusic API",
        "docs_url": "/docs",
        "status": "online",
        "developer": "Vivek Dalvi"
    }

@app.get("/health", tags=["System"])
"""
    content = content.replace('@app.get("/health", tags=["System"])', root_route)
    with open(filepath, 'w') as f:
        f.write(content)
    print("Root route added!")
else:
    print("File not found")
