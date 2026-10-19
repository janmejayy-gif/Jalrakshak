# ML Service Dockerfile - Multi-stage build for FastAPI
# NOTE: Docker is not currently available in the development environment.
# This file is provided for future containerization when Docker is available.

FROM python:3.13-slim AS builder
WORKDIR /app
RUN pip install --no-cache-dir uv
COPY requirements.txt .
RUN uv pip install --system -r requirements.txt

FROM python:3.13-slim
WORKDIR /app
RUN groupadd -r appuser && useradd -r -g appuser appuser
COPY --from=builder /usr/local/lib/python3.13/site-packages /usr/local/lib/python3.13/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin
COPY app/ app/
COPY .env.example .env
USER appuser
EXPOSE 8000
ENV PYTHONUNBUFFERED=1
ENTRYPOINT ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]