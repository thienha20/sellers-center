const os = require('os')
const path = require('path')
const dotEnv = require('dotenv')
dotEnv.config(path.resolve(process.cwd(), '.env'))
const node_port = process.env.PORT || 6000
const env = process.env.NODE_ENV || "development"

const config = {
  name: 'seller-center-' + node_port,
  script: 'server.js',
  exec_mode: 'cluster',
  instances: 2,
  autorestart: true,
  watch: ["./server.js"],
  watch_delay: 2000,
  max_memory_restart: '3G',
  env: {
    NODE_ENV: env,
    PORT: node_port,
  }
}

/*if (process.env.NODE_ENV === 'development') {
  config.instances = os.cpus().length
}*/

module.exports = {
  apps: [
	config
    /*{
      name: config.name + '-watching-code',
      script: 'gulp',
      args: 'watchFiles',
    }, config*/
  ]
}
