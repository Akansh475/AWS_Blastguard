import { AppConfig, config as defaultConfig } from '../config';
import { AWSResourceProvider } from './AWSResourceProvider';
import { MockResourceProvider } from './MockResourceProvider';
import { ResourceProvider } from './ResourceProvider';

export * from './ResourceProvider';
export * from './MockResourceProvider';
export * from './AWSResourceProvider';

let providerInstance: ResourceProvider | null = null;

export function getResourceProvider(appConfig: AppConfig = defaultConfig): ResourceProvider {
  if (providerInstance) {
    return providerInstance;
  }

  if (appConfig.mode === 'aws') {
    providerInstance = new AWSResourceProvider(appConfig.awsRegion);
  } else {
    providerInstance = new MockResourceProvider();
  }

  return providerInstance;
}

/**
 * Reset provider instance (useful for testing)
 */
export function setResourceProvider(provider: ResourceProvider | null): void {
  providerInstance = provider;
}
