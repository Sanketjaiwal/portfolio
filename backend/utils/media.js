const fs = require('fs');
const path = require('path');
const { pipeline } = require('stream');
const mongoose = require('mongoose');

const { GridFSBucket, ObjectId } = mongoose.mongo;
const bucketName = 'media';
const uploadsDirectory = path.resolve(__dirname, '../uploads');

const getBucket = () => {
  if (!mongoose.connection.db) {
    throw new Error('MongoDB must be connected before accessing uploaded media');
  }
  return new GridFSBucket(mongoose.connection.db, { bucketName });
};

const toObjectId = (value) => {
  if (typeof value !== 'string' || !/^[a-f\d]{24}$/i.test(value)) return null;
  return new ObjectId(value);
};

const getGridFsId = (filePath) => {
  const match = typeof filePath === 'string' && filePath.match(/^\/api\/media\/([a-f\d]{24})$/i);
  return match ? toObjectId(match[1]) : null;
};

const getLocalUploadPath = (filePath) => {
  if (typeof filePath !== 'string' || !filePath.startsWith('/uploads/')) return null;
  const resolvedPath = path.resolve(uploadsDirectory, filePath.slice('/uploads/'.length));
  return resolvedPath.startsWith(`${uploadsDirectory}${path.sep}`) ? resolvedPath : null;
};

const gridFsStorage = {
  _handleFile(req, file, callback) {
    let uploadStream;
    try {
      uploadStream = getBucket().openUploadStream(file.originalname, {
        metadata: { contentType: file.mimetype },
      });
    } catch (error) {
      callback(error);
      return;
    }

    pipeline(file.stream, uploadStream, (error) => {
      if (error) {
        callback(error);
        return;
      }

      callback(null, {
        id: uploadStream.id.toString(),
        filename: uploadStream.filename,
      });
    });
  },

  _removeFile(req, file, callback) {
    if (!file.id) {
      callback(null);
      return;
    }

    removeGridFsFile(file.id).then(() => callback(null), callback);
  },
};

const removeGridFsFile = async (fileId) => {
  const id = fileId instanceof ObjectId ? fileId : toObjectId(fileId);
  if (!id) return;

  const bucket = getBucket();
  if (await bucket.find({ _id: id }).hasNext()) {
    await bucket.delete(id);
  }
};

const deleteMedia = async (filePath) => {
  const gridFsId = getGridFsId(filePath);
  if (gridFsId) {
    await removeGridFsFile(gridFsId);
    return;
  }

  const localPath = getLocalUploadPath(filePath);
  if (localPath && fs.existsSync(localPath)) {
    await fs.promises.unlink(localPath);
  }
};

const mediaUrl = (file) => `/api/media/${file.id}`;

const serveMedia = async (req, res, next, fileId, downloadName) => {
  try {
    const id = toObjectId(fileId);
    if (!id) return res.status(404).json({ message: 'File not found' });

    const bucket = getBucket();
    const file = await bucket.find({ _id: id }).next();
    if (!file) return res.status(404).json({ message: 'File not found' });

    const filename = (downloadName || file.filename || 'media')
      .replace(/[\\/\r\n"]/g, '_');
    res.setHeader('Content-Type', file.metadata?.contentType || 'application/octet-stream');
    res.setHeader('Content-Disposition', `${downloadName ? 'attachment' : 'inline'}; filename*=UTF-8''${encodeURIComponent(filename)}`);
    res.setHeader('Accept-Ranges', 'bytes');

    let start;
    let end = file.length - 1;
    const range = req.headers.range;
    if (range) {
      const match = range.match(/^bytes=(\d*)-(\d*)$/);
      if (!match || (!match[1] && !match[2])) {
        res.setHeader('Content-Range', `bytes */${file.length}`);
        return res.status(416).end();
      }

      if (match[1]) {
        start = Number(match[1]);
        if (match[2]) end = Math.min(Number(match[2]), end);
      } else {
        const suffixLength = Number(match[2]);
        start = Math.max(file.length - suffixLength, 0);
      }

      if (start >= file.length || start > end) {
        res.setHeader('Content-Range', `bytes */${file.length}`);
        return res.status(416).end();
      }

      res.status(206);
      res.setHeader('Content-Range', `bytes ${start}-${end}/${file.length}`);
    }

    const stream = start === undefined
      ? bucket.openDownloadStream(id)
      : bucket.openDownloadStream(id, { start, end: end + 1 });
    res.setHeader('Content-Length', start === undefined ? file.length : end - start + 1);
    stream.on('error', (error) => {
      if (res.headersSent) res.destroy(error);
      else next(error);
    });
    stream.pipe(res);
  } catch (error) {
    next(error);
  }
};

const sendMediaFile = (req, res, next, filePath, downloadName) => {
  const gridFsId = getGridFsId(filePath);
  if (gridFsId) return serveMedia(req, res, next, gridFsId.toString(), downloadName);

  const localPath = getLocalUploadPath(filePath);
  if (!localPath || !fs.existsSync(localPath)) {
    return res.status(404).json({ message: 'File not found' });
  }
  if (downloadName) return res.download(localPath, downloadName, next);
  return res.sendFile(localPath, next);
};

module.exports = {
  deleteMedia,
  gridFsStorage,
  mediaUrl,
  sendMediaFile,
  serveMedia,
};
