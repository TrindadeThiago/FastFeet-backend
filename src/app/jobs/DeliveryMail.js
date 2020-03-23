import Mail from '../../lib/Mail';

class DeliveryMail {
  get key() {
    return 'DeliveryMail';
  }

  async handle({ data }) {
    const { order } = data;

    await Mail.sendMail({
      to: `${order.deliveryman.name} <${order.deliveryman.email}>`,
      subject: 'Nova entrega disponivel',
      template: 'delivery',
      context: {
        deliveryman: order.deliveryman.name,
        product: order.product,
      },
    });
  }
}

export default new DeliveryMail();
