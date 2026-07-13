# Use Node 20 as base image
FROM node:20-bookworm

# Install Python 3, pip, and necessary libraries for OpenCV (libgl1, libglib2.0-0)
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-venv \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Install pnpm for frontend
RUN npm install -g pnpm

WORKDIR /app

# 1. Setup YOLO Service (Python)
# Create a virtual environment and add it to PATH
RUN python3 -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"
COPY yolo-service/requirements.txt ./yolo-service/
RUN pip install --no-cache-dir -r yolo-service/requirements.txt

# 2. Setup Backend Server (Node.js)
COPY server/package*.json ./server/
RUN cd server && npm install

# 3. Setup Frontend (React / Vite)
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
# Copy frontend source files
COPY vite.config.ts tailwind.config.ts postcss.config.js tsconfig*.json components.json eslint.config.js index.html ./
COPY public ./public
COPY src ./src
# Install dependencies and build
RUN pnpm install
RUN pnpm run build

# 4. Copy the rest of the application code
COPY . .

# Expose ports for YOLO (5001), Backend (5000), and Frontend (8081)
EXPOSE 5001 5000 8081

# Create a startup script to run all services
RUN echo '#!/bin/bash\n\
echo "Starting YOLO service..."\n\
cd /app/yolo-service && python3 app.py &\n\
\n\
echo "Starting Backend server..."\n\
cd /app/server && node index.js &\n\
\n\
echo "Starting Frontend..."\n\
cd /app && pnpm run preview -- --host 0.0.0.0 --port 8081\n\
\n\
wait -n\n\
' > /app/start.sh && chmod +x /app/start.sh

# Start all services
CMD ["/app/start.sh"]
