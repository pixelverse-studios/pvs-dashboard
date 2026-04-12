import { createRequire } from 'module'
import eslintConfigPrettier from 'eslint-config-prettier'

const require = createRequire(import.meta.url)
const nextConfig = require('eslint-config-next/core-web-vitals')

const config = [...nextConfig, eslintConfigPrettier]

export default config
