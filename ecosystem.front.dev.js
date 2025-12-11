module.exports = {
  apps: [
    {
      name: "react-dev",
      script: "npm",
      args: "run dev -- --host 0.0.0.0 --port 5174",
      env: {
        NODE_ENV: "development"
      }
    }
  ]
};