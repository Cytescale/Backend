module.exports = {
  apps: [
    {
      name: "Backend",
      watch: ["./src/server/index.js"],
      script: "src/index.js",
      instances: 1,
      max_memory_restart: "256M",
    },
  ],
};
