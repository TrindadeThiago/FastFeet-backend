import File from '../models/File';

class FileController {
  async store(req, res) {
    const { originalname: name, filename: path } = req.file;
    const { file_type_id } = req.body;

    const file = await File.create({
      name,
      path,
      file_type_id,
    });

    return res.json(file);
  }
}

export default new FileController();
