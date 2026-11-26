import '@testing-library/jest-dom'
import { setImmediate as nodeSetImmediate } from 'node:timers'

global.setImmediate = nodeSetImmediate

jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}))

jest.mock('socket.io-client', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    on: jest.fn(),
    disconnect: jest.fn(),
    removeAllListeners: jest.fn(),
  })),
}))

jest.mock('./src/services/api', () => ({
  api: {
    get: jest.fn().mockResolvedValue({
      data: [{ _id: 'foo', company: 'bar', thumbnail_url: 'image.png' }],
    }),
    post: jest.fn().mockResolvedValue({ data: { _id: 'some-user-id' } }),
  },
}))
