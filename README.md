# 🚀 Scalable Microservices URL Shortener AKA urlite

A high-performance URL shortener built with an event-driven microservices architecture. Designed to handle high concurrency using Redis caching and asynchronous background processing.

## 🏗 Architecture
* **Frontend:** React.js (Tailwind CSS)
* **API Gateway:** Nginx (Reverse Proxy)
* **Backend:** Node.js (Express)
* **Database:** PostgreSQL (Persistent Storage)
* **Caching:** Redis (High-speed lookup)
* **Worker:** Background service for analytics (Producer-Consumer pattern)
* **Deployment:** Docker Compose + Cloudflare Tunnels

## ✨ Features
* **Event-Driven Stats:** Click analytics are processed asynchronously to prevent API blocking.
* **Smart Caching:** Frequent redirects are served from Redis (Sub-millisecond latency).
* **Secure Tunneling:** Exposed to the web via Cloudflare Zero Trust (No open ports).
* **Live Analytics:** Tracks clicks and creation timestamps.

## 🛠 Installation

1.  **Clone the repo**
    ```bash
    git clone [https://github.com/yourusername/microservices-url-shortener.git](https://github.com/yourusername/microservices-url-shortener.git)
    cd microservices-url-shortener
    ```

2.  **Setup Environment**
    Copy the example env file and add your secrets.
    ```bash
    cp .env.example .env
    ```

3.  **Run with Docker**
    ```bash
    docker-compose up -d --build
    ```

4.  **Visit App**
    Open `https://shortener.dsrinibas.space/`