
import { createClient } from 'redis';

export class RedisCache {
  private client;

  constructor() {
    this.client = createClient();
    this.client.connect();
  }

  async get(key: string) {
    const value = await this.client.get(key);
    return value ? JSON.parse(value) : null;
  }

  async set(key: string, value: any, ttl: number) {
    await this.client.set(key, JSON.stringify(value), {
      EX: ttl,
    });
  }
}

export default new RedisCache();