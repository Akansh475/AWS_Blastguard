import { AppConfig, config as defaultConfig } from '../config';
import { AWSResourceProvider } from './AWSResourceProvider';
import { MockResourceProvider } from './MockResourceProvider';
import { ResourceProvider } from './ResourceProvider';

export * from './ResourceProvider';
export * from './MockResourceProvider';
export * from './AWSResourceProvider';

let providerInstance: ResourceProvider | null = null;
let currentMode: string | null = null;
let explicitlyInjected = false;

export function getResourceProvider(appConfig: AppConfig = defaultConfig): ResourceProvider {
  // If explicitly injected via setResourceProvider, return it directly
  if (explicitlyInjected && providerInstance) {
    return providerInstance;
  }

  if (providerInstance && currentMode === appConfig.mode) {
    return providerInstance;
  }

  currentMode = appConfig.mode;
  if (appConfig.mode === 'aws') {
    providerInstance = new AWSResourceProvider(appConfig.awsRegion);
  } else {
    providerInstance = new MockResourceProvider();
  }

  return providerInstance;
}

/**
 * Reset or explicitly inject provider instance (useful for testing)
 */
export function setResourceProvider(provider: ResourceProvider | null): void {
  providerInstance = provider;
  explicitlyInjected = provider !== null;
  currentMode = null;
}

/**
 * Reset provider cache and instance to defaults
 */
export function resetResourceProvider(): void {
  providerInstance = null;
  explicitlyInjected = false;
  currentMode = null;
}


