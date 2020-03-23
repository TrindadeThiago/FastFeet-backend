import * as Yup from 'yup';

import Order from '../models/Orders';
import Recipient from '../models/Recipients';
import Deliveryman from '../models/Deliverymans';
import File from '../models/File';

import DeliveryMail from '../jobs/DeliveryMail';
import Queue from '../../lib/Queue';

class OrderController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const orders = await Order.findAll({
      attributes: ['id', 'product'],
      limit: 10,
      offset: (page - 1) * 10,
      include: [
        {
          model: Deliveryman,
          as: 'deliveryman',
          attributes: ['id', 'name'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['id', 'path', 'url'],
            },
          ],
        },
        {
          model: Recipient,
          as: 'recipient',
          attributes: [
            'id',
            'name',
            'rua',
            'numero',
            'cep',
            'cidade',
            'estado',
          ],
        },
      ],
    });

    return res.json(orders);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      recipient_id: Yup.number().required(),
      deliveryman_id: Yup.number().required(),
      product: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação' });
    }

    const recipientExist = await Recipient.findByPk(req.body.recipient_id);

    if (!recipientExist) {
      return res.status(400).json({ error: 'Endereço não encontrado' });
    }

    const deliverymanExist = await Deliveryman.findByPk(
      req.body.deliveryman_id
    );

    if (!deliverymanExist) {
      return res.status(400).json({ error: 'Entregador não encontrado' });
    }

    const { id, recipient_id, deliveryman_id, product } = await Order.create(
      req.body
    );

    const order = await Order.findByPk(id, {
      include: [
        {
          model: Deliveryman,
          as: 'deliveryman',
          attributes: ['name', 'email'],
        },
      ],
    });

    await Queue.add(DeliveryMail.key, {
      order,
    });

    return res.json({ id, recipient_id, deliveryman_id, product });
  }
}

export default new OrderController();
