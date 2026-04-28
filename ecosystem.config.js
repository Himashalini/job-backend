module.exports = {
  apps: [
    {
      name: "job-affiliate-backend",
      script: "src/server.js",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "300M",
      env: {
        NODE_ENV: "development",
        PORT: 5000,
      },
      env_production: {
        NODE_ENV: "production",
        PORT: process.env.PORT || 5000,
      },
    },
  ],
};
