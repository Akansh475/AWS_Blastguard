import { NextFunction, Request, Response } from 'express';
import { getResourceProvider } from '../providers';
import { NotFoundError } from '../utils/errors';
import { sendSuccess } from '../utils/response';
import { validateRequestIdParam } from '../utils/validation';

export async function getResourceByIdHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const resourceId = validateRequestIdParam(req.params.resourceId);
    const provider = getResourceProvider();
    const resource = await provider.getResource(resourceId);

    if (!resource) {
      throw new NotFoundError(`Resource with ID '${resourceId}' not found`);
    }

    sendSuccess(res, resource, 200);
  } catch (err) {
    next(err);
  }
}

export async function listResourcesHandler(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const provider = getResourceProvider();
    const resources = await provider.listResources();
    sendSuccess(res, resources, 200, { total: resources.length });
  } catch (err) {
    next(err);
  }
}

export async function getResourceDependenciesHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const resourceId = validateRequestIdParam(req.params.resourceId);
    const provider = getResourceProvider();
    const resource = await provider.getResource(resourceId);

    if (!resource) {
      throw new NotFoundError(`Resource with ID '${resourceId}' not found`);
    }

    const dependencies = await provider.getDependencies(resourceId);
    sendSuccess(res, dependencies, 200, { total: dependencies.length });
  } catch (err) {
    next(err);
  }
}
