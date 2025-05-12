export class DashboardController {
  constructor({ spotService }) {
    this._spotService = spotService;
  }

  show = async (req, res) => {
    const { user_id } = req.headers;

    if (!user_id) {
      return res.status(400).json({ error: 'User ID is required.' });
    }

    const spots = await this._spotService.listByUserId(user_id);

    return res.json(spots);
  };
}
