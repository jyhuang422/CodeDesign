import { client } from 'universal-webpack/config'
import settings from '../universal-webpack-settings'
import devConfig from './dev.config'
import prodConfig from './prod.config'

var env = process.env.NODE_ENV;
var configuration = (env && env === 'production') ? prodConfig : devConfig;

export default client(configuration, settings)