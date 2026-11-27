import type { Request, Response } from 'express';

export class SessionController {
  private readonly _sessionService: { create(email: string): Promise<unknown> };

  constructor({
    sessionService,
  }: {
    sessionService: SessionController['_sessionService'];
  }) {
    this._sessionService = sessionService;
  }

  create = async (req: Request, res: Response) => {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'User email is required.' });
    }

    const user = await this._sessionService.create(email);

    return res.json(user);
  };
}
