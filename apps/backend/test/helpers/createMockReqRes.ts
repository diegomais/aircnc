import type { Request, Response } from 'express';

type MockResponse = Response & {
  getStatus: () => number | null;
  getJson: () => unknown;
};

export function createMockReqRes({
  body = {},
  headers = {},
}: {
  body?: Record<string, unknown>;
  headers?: Record<string, string>;
} = {}): { req: Request; res: MockResponse } {
  const req = { body, headers } as unknown as Request;
  let statusCode: number | null = null;
  let jsonResponse: unknown = null;

  const res = {
    status(code: number) {
      statusCode = code;
      return res;
    },
    json(data: unknown) {
      jsonResponse = data;
      return res;
    },
    getStatus: () => statusCode,
    getJson: () => jsonResponse,
  } as unknown as MockResponse;

  return { req, res };
}
