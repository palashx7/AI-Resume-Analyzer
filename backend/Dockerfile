# 1️⃣ Base image: official Python
FROM python:3.11-slim

# 2️⃣ Prevent Python from buffering logs
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# 3️⃣ Set working directory inside container
WORKDIR /app

# 4️⃣ Install system dependencies (minimal)
RUN apt-get update \
    && apt-get install -y --no-install-recommends gcc \
    && rm -rf /var/lib/apt/lists/*

# 5️⃣ Copy requirements first (for caching)
COPY requirements.txt .

# 6️⃣ Install Python dependencies
RUN pip install --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt


# 7️⃣ Copy the rest of the backend code
COPY app ./app

# 8️⃣ Expose port (FastAPI default)
EXPOSE 8000

# 9️⃣ Run FastAPI with uvicorn
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
