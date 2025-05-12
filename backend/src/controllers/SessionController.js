export class SessionController {
  constructor({ sessionService }) {
    this._sessionService = sessionService
  }

  create = async (req, res) => {
    const { email } = req.body;

    const user = await this._sessionService.create(email);

    return res.json(user);
  }
};
