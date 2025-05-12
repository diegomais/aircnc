export class DashboardController {
  constructor({ spotsService }) {
    this._spotsService = spotsService;
  }

  show = async (req, res) => {
    const { user_id } = req.headers;

    if (!user_id) {
      return res.status(400).json({ error: 'User ID is required.' });
    }

    const spots = await this._spotsService.listByUserId(user_id);

    return res.json(spots);
  };
}
