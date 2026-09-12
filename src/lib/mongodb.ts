import { Resolver } from 'dns/promises';
import { MongoClient, Db } from 'mongodb';

/**
 * Dynamically resolves mongodb+srv:// records using public DNS servers (8.8.8.8, 1.1.1.1)
 * to prevent Windows ISP "querySrv ECONNREFUSED" errors while preserving mongodb+srv:// URI in .env.local.
 */
async function resolveSrvConnectionString(uri: string): Promise<string> {
  if (!uri.startsWith('mongodb+srv://')) {
    return uri;
  }

  try {
    const url = new URL(uri.replace('mongodb+srv://', 'http://'));
    const resolver = new Resolver();
    resolver.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);

    // 1. Resolve SRV record for shard nodes
    const srvRecords = await resolver.resolveSrv(`_mongodb._tcp.${url.hostname}`);
    if (!srvRecords || srvRecords.length === 0) {
      return uri;
    }

    const hosts = srvRecords.map((r) => `${r.name}:${r.port}`).join(',');

    // 2. Resolve TXT record for replicaSet & auth options
    let txtParams = '';
    try {
      const txtRecords = await resolver.resolveTxt(url.hostname);
      txtParams = txtRecords.map((t) => t.join('')).join('&');
    } catch {
      // Optional TXT record
    }

    const auth = url.username
      ? `${url.username}${url.password ? `:${url.password}` : ''}@`
      : '';
    const pathname = url.pathname || '/';
    const searchParams = new URLSearchParams(url.search);

    if (txtParams) {
      const txtSearch = new URLSearchParams(txtParams);
      txtSearch.forEach((v, k) => {
        if (!searchParams.has(k)) {
          searchParams.set(k, v);
        }
      });
    }

    if (!searchParams.has('ssl')) {
      searchParams.set('ssl', 'true');
    }

    return `mongodb://${auth}${hosts}${pathname}?${searchParams.toString()}`;
  } catch (err) {
    console.warn('Dynamic SRV resolution fallback:', err);
    return uri;
  }
}

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

let cachedPromise: Promise<MongoClient> | null = null;

async function createClient(uri: string): Promise<MongoClient> {
  // First try standard SRV connection
  try {
    const standardClient = new MongoClient(uri);
    await standardClient.connect();
    return standardClient;
  } catch (err: any) {
    // If querySrv ECONNREFUSED occurs on Windows, dynamically resolve SRV with 8.8.8.8/1.1.1.1
    if (
      err?.code === 'ECONNREFUSED' ||
      err?.syscall === 'querySrv' ||
      uri.startsWith('mongodb+srv://')
    ) {
      const resolvedUri = await resolveSrvConnectionString(uri);
      const resolvedClient = new MongoClient(resolvedUri);
      await resolvedClient.connect();
      return resolvedClient;
    }
    throw err;
  }
}

/**
 * Lazy, on-demand client acquisition.
 * Never executes at build/compile time, preventing Vercel build crashes.
 */
export async function getClientPromise(): Promise<MongoClient> {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error(
      'MONGODB_URI is not defined. Please set MONGODB_URI in your environment variables.'
    );
  }

  if (process.env.NODE_ENV === 'development') {
    if (!global._mongoClientPromise) {
      global._mongoClientPromise = createClient(uri);
    }
    return global._mongoClientPromise;
  }

  if (!cachedPromise) {
    cachedPromise = createClient(uri);
  }
  return cachedPromise;
}

/**
 * Helper to get MongoDB Database instance on-demand
 */
export async function getDatabase(dbName?: string): Promise<Db> {
  const targetDb = dbName || process.env.MONGODB_DB || 'aetheris_3d';
  const connectedClient = await getClientPromise();
  return connectedClient.db(targetDb);
}

export default getClientPromise;
