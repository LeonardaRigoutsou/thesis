

const upload = (req, res, next) => {

    if (!req.file) {
        return res.status(404).json({ message: 'File not uploaded' });
    }

    return res.status(200).json({ message: 'File uploaded' });
}


exports.upload = upload;