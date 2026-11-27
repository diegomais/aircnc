import type { Request, Response } from 'express';

export class DashboardController {
  private readonly _spotsService: {
    listByUserId(userId: string): Promise<unknown>;
  };

  constructor({
    spotsService,
  }: {
    spotsService: DashboardController['_spotsService'];
  }) {
    this._spotsService = spotsService;
  }

  show = async (req: Request, res: Response) => {
    const { user_id } = req.headers;

    if (typeof user_id !== 'string') {
      return res.status(400).json({ error: 'User ID is required.' });
    }

    const spots = await this._spotsService.listByUserId(user_id);

    return res.json(spots);
  };
}
