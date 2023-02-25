module.exports = {
  apps: [
    {
      name: "Backend Instance",
      script: "src/index.js",
      instances: 1,
      max_memory_restart: "256M",
    },
  ],
};
