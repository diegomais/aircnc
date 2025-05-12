export class SessionController {
  constructor({ sessionService }) {
    this._sessionService = sessionService
  }

  create = async (req, res) => {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'User email is required.' });
    }

    const user = await this._sessionService.create(email);

    return res.json(user);
  }
};
