import * as Yup from 'yup';

import Deliverymans from '../models/Deliverymans';
import File from '../models/File';

class DeliverymanController {
  async index(req, res) {
    const deliverymans = await Deliverymans.findAll({
      attributes: ['id', 'name', 'avatar_id'],
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['name', 'path', 'url'],
        },
      ],
    });

    return res.json(deliverymans);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.statu(400).json({ error: 'Falha de validação' });
    }

    const deliverymanExists = await Deliverymans.findOne({
      where: { email: req.body.email },
    });

    if (deliverymanExists) {
      return res.status(400).json({ error: 'Entegador já cadastrado' });
    }

    const { id, name, email } = await Deliverymans.create(req.body);

    return res.json({ id, name, email });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha de validação' });
    }

    const deliveryman = await Deliverymans.findByPk(req.params.id);

    if (!deliveryman) {
      return res.status(400).json({ error: 'Entregador não encontrado' });
    }

    const { id, name, email, avatar_id } = await deliveryman.update(req.body);

    return res.json({ id, name, email, avatar_id });
  }

  async delete(req, res) {
    const deliveryman = await Deliverymans.findByPk(req.params.id);

    if (!deliveryman) {
      return res.status(400).json({ error: 'Entregador não encontrado' });
    }

    Deliverymans.destroy({
      where: { id: req.params.id },
    });

    return res.status(200).json({ ok: 'Entregador deletato com sucesso' });
  }
}

export default new DeliverymanController();
