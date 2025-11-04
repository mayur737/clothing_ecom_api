// Import AWS SDK modules
const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3"); // Core S3 client
const { createPresignedPost } = require("@aws-sdk/s3-presigned-post"); // Presigned POST URL generation
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner"); // Presigned GET URL generation


async function getAwsConfig() {
    const aws = { region: process.env.AWS_REGION, access: process.env.AWS_ACCESS_KEY_ID, secret: AWS_SECRET_ACCESS_KEY, bucket: S3_BUCKET_NAME, pathref: process.env.AWSPATHREF }

    if (!aws) throw new Error("AWS config not found in DB");

    const s3Client = new S3Client({
        region: aws.region,
        credentials: {
            accessKeyId: aws.access,
            secretAccessKey: aws.secret,
        },
    });

    return { s3Client, aws };
}

async function createPost(key, mime) {
    const { s3Client, aws } = await getAwsConfig();

    const options = {
        Bucket: aws.bucket,
        Key: `${aws.pathref}/${key}`,
        Fields: {
            "Content-Type": mime,
            "Content-Disposition": "attachment",
            success_action_status: "201",
        },
        Conditions: [
            { bucket: aws.bucket },
            { success_action_status: "201" },
            ["content-length-range", 128, 1024 * 1024 * 5],
            { "x-amz-algorithm": "AWS4-HMAC-SHA256" },
        ],
        Expires: 300,
    };

    const post = await createPresignedPost(s3Client, options);

    return post;
}

async function createDownloadUrl(key, expires = 300) {
    const { s3Client, aws } = await getAwsConfig();

    const command = new GetObjectCommand({
        Bucket: aws.bucket,
        Key: `${aws.pathref}/${key}`,
    });

    try {
        const url = await getSignedUrl(s3Client, command, { expiresIn: expires });
        return url;
    } catch (error) {
        console.error("Error generating download URL:", error);
        throw error;
    }
}

module.exports = { createDownloadUrl, createPost };
