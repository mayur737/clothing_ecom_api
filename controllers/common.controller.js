const FileObjectModel = require("../models/FileObject");

const uploads = async (req, res, next) => {
    try {
        const aws = { region: process.env.AWS_REGION, access: process.env.AWS_ACCESS_KEY_ID, secret: AWS_SECRET_ACCESS_KEY, bucket: S3_BUCKET_NAME, pathref: process.env.AWSPATHREF }
        const { name, mime, size } = req.body;

        const _id = new mongoose.Types.ObjectId();
        const fnm = _id.toString() + path.extname(name);
        const url = `https://${aws.bucket}.s3.${aws.region}.amazonaws.com/${aws.pathref}/${fnm}`;

        await FileObjectModel.create({ _id, name, mime, size, url });

        const data = await createPost(fnm, mime);
        data._id = _id;

        res.status(200).json({ data, url });
    } catch (error) {
        console.log(error);
        next({ st: 500, ms: error.message });
    }
};

module.exports = { uploads }