const crypto = require('crypto');

const bootstrap = (file, Bucket) => {

    const fileSize = file.size || 1000 / 1000

    const fileSizeInMB = fileSize /1000

    const key = crypto.randomBytes(32).toString('hex');

    const [, extension] = file.originalname.split('.')

    const s3UploadParams = {
        Bucket,
        Key: `${key}.${extension}`,
        Body: file.buffer,
    }

    return { s3UploadParams, key, fileSizeInMB, fileSize, extension };
}

module.exports = bootstrap