const fs = require('fs-extra')
const path = require('path')
exports.loadEnvDefine = (mode) => {
    const envDefine = {}
    if (fs.existsSync(`.env.${mode}`)) {
        require('dotenv').config({ path: `.env.${mode}` })
        const prefixRE = /^VUE_APP_/
        const envDefine = {}
        for (const key in process.env) {
            if (key == 'NODE_ENV' || key == 'BASE_URL' || prefixRE.test(key)) {
                envDefine[key] = JSON.stringify(process.env[key])
            }
        }
    }
    return envDefine
}

exports.resolve = (dir) => {
    return path.join(__dirname, '..', dir)
}
