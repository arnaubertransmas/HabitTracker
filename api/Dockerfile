FROM python:3.11-slim

WORKDIR /app

# copy all dependencies first
COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5050

CMD ["python3", "main.py"]
