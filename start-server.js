import startServer from 'universal-webpack/server'
import settings from './universal-webpack-settings'
// `configuration.context` and `configuration.output.path` are used
import devConfig from './webpack/dev.config'
import prodConfig from './webpack/prod.config'

var env = process.env.NODE_ENV;
var configuration = (env && env === 'production') ? prodConfig : devConfig;

startServer(configuration, settings)