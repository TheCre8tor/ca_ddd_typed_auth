import { RedisClientType } from "redis";

export abstract class AbstractRedisClient {
  private tokenExpiryTime: number = 604800;
  protected client: RedisClientType;

  constructor(client: RedisClientType) {
    this.client = client;
  }

  public async getAllKeys(wildcard: string): Promise<string[]> {
    try {
      const allKeys = await this.client.keys(wildcard);
      return allKeys;
    } catch (err: any) {
      return err;
    }
  }

  public async count(key: string): Promise<number> {
    const allKeys = await this.getAllKeys(key);
    return allKeys.length;
  }

  public async exists(key: string): Promise<boolean> {
    try {
      const count = await this.count(key);
      const result = count >= 1 ? true : false;

      return result;
    } catch (err: any) {
      return err;
    }
  }

  public async getOne<T>(key: string): Promise<T> {
    try {
      const singleKey = (await this.client.get(key)) as unknown as T;
      return singleKey;
    } catch (err: any) {
      return err;
    }
  }

  public async getAllKeyValue(wildcard: string): Promise<any[]> {
    try {
      const result = await this.client.keys(wildcard);

      const allResults = await result.map(async (key) => {
        const value = await this.getOne(key);
        return { key, value };
      });

      return allResults;
    } catch (err: any) {
      return err;
    }
  }

  public async set(key: string, value: any): Promise<any> {
    try {
      const result = await this.client.set(key, value);
      await this.client.expire(key, this.tokenExpiryTime);

      return result;
    } catch (err: any) {
      return err;
    }
  }

  public async deleteOne(key: string): Promise<number> {
    try {
      const result = await this.client.del(key);
      return result;
    } catch (err: any) {
      return err;
    }
  }

  public async testConnection(): Promise<any> {
    try {
      const result = await this.client.set("test", "connected");
      return result;
    } catch (err: any) {
      return err;
    }
  }
}
