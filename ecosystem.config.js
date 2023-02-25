module.exports = {
  apps: [
    {
      name: "Backend",
      script: "src/index.js",
      instances: 1,
      max_memory_restart: "256M",
    },
  ],
};
