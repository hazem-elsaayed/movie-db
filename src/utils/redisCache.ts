import { createClient } from 'redis';
import dotenv from 'dotenv';
import { ICache } from './interfaces.js';
dotenv.config();

export class RedisCache implements ICache {
  private client;

  constructor() {
    this.client = createClient({
      url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
    });
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

  async del(key: string) {
    await this.client.del(key);
  }

  async delPattern(pattern: string) {
    const keys = await this.client.keys(pattern);
    keys.forEach((key) => this.client.del(key));
  }
}

export default new RedisCache();