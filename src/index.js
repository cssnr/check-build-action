const fs = require('fs')
const core = require('@actions/core')
const exec = require('@actions/exec')
const github = require('@actions/github')

const { Pull } = require('./api')

;(async () => {
    try {
        core.info(`🏳️ Starting Check Build Action`)

        // // Debug
        // core.startGroup('Debug: github.context')
        // console.log(github.context)
        // core.endGroup() // Debug github.context
        // core.startGroup('Debug: process.env')
        // console.log(process.env)
        // core.endGroup() // Debug process.env
        console.log('sender.login:', github.context.payload.sender.login)
        console.log('TRIGGERING_ACTOR:', process.env.GITHUB_TRIGGERING_ACTOR)

        // Get Config
        const config = getConfig()
        core.startGroup('Get Config')
        console.log(config)
        core.endGroup() // Config

        // Step 1 - Check for error
        let error = ''
        if (config.path && !fs.existsSync(config.path)) {
            console.log('Checking Path:', config.path)
            error = `Path not found: ${config.path}`
        }
        try {
            const build = await checkOutput(config.build)
            console.log('build:', build)
            const check = await checkOutput(config.check)
            console.log('check:', check)
        } catch (e) {
            console.log('error:', e)
            error = e.message || 'Verification Failed.'
            // return core.setFailed('Verification FAILED!!!')
        }
        console.log('error:', error)

        // Step 2 - Update comment IF pull_request
        let comment
        if (config.comment && github.context.eventName === 'pull_request') {
            core.startGroup(`Processing PR: ${github.context.payload.number}`)
            comment = await updatePull(config, error)
            core.endGroup() // Processing PR
        }
        console.log('comment:', comment)

        // Outputs
        core.info('📩 Setting Outputs')
        core.setOutput('id', comment?.id || 0)
        core.setOutput('error', error.toString())

        // Summary
        if (config.summary) {
            core.info('📝 Writing Job Summary')
            try {
                await addSummary(config, error, comment)
            } catch (e) {
                console.log(e)
                core.error(`Error writing Job Summary ${e.message}`)
            }
        }

        // Step 3 - Exit failed IF error
        if (error) {
            return core.setFailed(error)
        }

        core.info(`✅ \u001b[32;1mFinished Success`)
    } catch (e) {
        core.debug(e)
        core.info(e.message)
        core.setFailed(e.message)
    }
})()

/**
 * Update PR
 * @param {Config} config
 * @param {*} error
 * @return {Promise<Object|undefined>}
 */
async function updatePull(config, error) {
    if (!github.context.payload.pull_request?.number) {
        throw new Error('No Pull Request number!')
    }

    // Step 1 - No Comments and No Error
    if (!github.context.payload.pull_request.comments && !error) {
        console.log('No Comments and No Error. Skipping...')
        return
    }

    // Step 2 - Get Current Comment
    const id = `<!-- check-build-action -->`
    const pull = new Pull(github.context, config.token)
    let comment = await pull.getComment(id)
    console.log('comment:', comment)

    // Step 3 - Delete Comment IF comment
    if (comment) {
        console.log('Deleting Comment:', comment.id)
        try {
            await pull.deleteComment(comment.id)
        } catch (e) {
            core.error(`Error Deleting Comment: ${comment.id} - ${e}`)
        }
    }

    // Step 4 - Add New Comment IF error
    if (error) {
        console.log('Adding New Comment')
        const mention = config.mention
            ? `@${github.context.payload.sender.login} - `
            : ''
        const body = `${id}\n${mention}${config.message}`
        const response = await pull.createComment(body)
        // TODO: Add error handling
        console.log('response.status:', response.status)
        return response.data
    }
}

/**
 * Check Command Output
 * @param {String} command
 * @param {Object} [options]
 * @return {Promise<String>}
 */
async function checkOutput(command, options = {}) {
    const args = command.split(' ')
    const commandLine = args.shift()
    console.log('checkOutput:', command, args)

    let myOutput = ''
    let myError = ''
    options.listeners = {
        stdout: (data) => {
            myOutput += data.toString()
        },
        stderr: (data) => {
            myError += data.toString()
        },
    }
    await exec.exec(commandLine, args, options)
    console.log('myError:', myError)
    // return [myOutput, myError]
    return myOutput.trim()
}

/**
 * Add Summary
 * @param {Config} config
 * @param {String} error
 * @param {Object} comment
 * @return {Promise<void>}
 */
async function addSummary(config, error, comment) {
    core.summary.addRaw('## Check Build Action\n\n')

    if (comment) {
        const url = `https://github.com/${github.context.repo.owner}/${github.context.repo.repo}/pull/${github.context.payload.number}#issuecomment-${comment.id}`
        core.summary.addRaw(
            `PR Comment: [#${github.context.payload.number}](${url}) \n\n`
        )
    } else {
        core.summary.addRaw('No PR Comment Found.\n\n')
    }

    if (error) {
        core.summary.addRaw(`⛔ ${error}\n\n---\n\n`)
    } else {
        core.summary.addRaw(`✅ Success\n\n---\n\n`)
    }

    delete config.token
    const yaml = Object.entries(config)
        .map(([k, v]) => `${k}: ${JSON.stringify(v)}`)
        .join('\n')
    core.summary.addRaw('<details><summary>Config</summary>')
    core.summary.addCodeBlock(yaml, 'yaml')
    core.summary.addRaw('</details>\n')

    const text = 'View Documentation, Report Issues or Request Features'
    const link = 'https://github.com/cssnr/check-build-action'
    core.summary.addRaw(`\n[${text}](${link}?tab=readme-ov-file#readme)\n\n---`)
    await core.summary.write()
}

/**
 * Get Config
 * @typedef {Object} Config
 * @property {String} build
 * @property {String} check
 * @property {String} [path]
 * @property {Boolean} comment
 * @property {String} message
 * @property {Boolean} mention
 * @property {Boolean} summary
 * @property {String} token
 * @return {Config}
 */
function getConfig() {
    return {
        build: core.getInput('build', { required: true }),
        check: core.getInput('check', { required: true }),
        path: core.getInput('path'),
        comment: core.getBooleanInput('comment'),
        message: core.getInput('message', { required: true }),
        mention: core.getBooleanInput('mention'),
        summary: core.getBooleanInput('summary'),
        token: core.getInput('token', { required: true }),
    }
}
