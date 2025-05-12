export class DashboardController {
  constructor({ spotService }) {
    this._spotService = spotService;
  }

  show = async (req, res) => {
    const { user_id } = req.headers;
    
    const spots = await this._spotService.listByUserId(user_id);

    return res.json(spots);
  };
}
