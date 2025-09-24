const github = require('@actions/github')

class Pull {
    /**
     * Pull Request Manager
     * @param {Object} context
     * @param {String} token
     */
    constructor(context, token) {
        if (!context.payload.pull_request) {
            throw new Error('Missing: context.payload.pull_request')
        }
        this.repo = context.repo
        this.pull_request = context.payload.pull_request
        this.octokit = github.getOctokit(token)
    }

    /**
     * Get Comment by startsWith
     * NOTE: Process additional pages, max per_page is 100
     * @param {String} start
     * @return {Promise<Object|undefined>}
     */
    async getComment(start) {
        if (this.pull_request.comments && start) {
            const comments = await this.octokit.rest.issues.listComments({
                ...this.repo,
                issue_number: this.pull_request.number,
                per_page: 100,
            })
            // NOTE: Add error handling
            console.log('comments.status:', comments.status)
            // console.log('comments.data:', comments.data)
            if (comments.data.length) {
                for (const comment of comments.data) {
                    // console.log('comment:', comment)
                    if (comment.body.startsWith(start)) {
                        return comment
                    }
                }
            }
        }
    }

    /**
     * Create Comment
     * @param {String} body
     * @return {Promise<Object>}
     */
    async createComment(body) {
        return await this.octokit.rest.issues.createComment({
            ...this.repo,
            issue_number: this.pull_request.number,
            body,
        })
    }

    /**
     * Delete Comment
     * @param {String} comment_id
     * @return {Promise<Object>}
     */
    async deleteComment(comment_id) {
        return await this.octokit.rest.issues.deleteComment({
            ...this.repo,
            comment_id,
        })
    }

    /**
     * Update Comment
     * @param {String} comment_id
     * @param {String} body
     * @return {Promise<Object>}
     */
    // noinspection JSUnusedGlobalSymbols
    async updateComment(comment_id, body) {
        return await this.octokit.rest.issues.updateComment({
            ...this.repo,
            comment_id,
            body,
        })
    }
}

module.exports = { Pull }
