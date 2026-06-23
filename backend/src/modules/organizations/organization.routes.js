import express from 'express';

import auth from '../../shared/middlewares/auth.middleware.js';
import permissions from '../../shared/middlewares/permissions.middleware.js';

import {
  createOrganization,
  getOrganizations,
  getOrganization,
  updateOrganization,
  deleteOrganization
} from './organization.controller.js';

const router = express.Router();

router.post(
  '/',
  auth,
  permissions('organization:create'),
  createOrganization
);

router.get(
  '/',
  auth,
  permissions('organization:view'),
  getOrganizations
);

router.get(
  '/:id',
  auth,
  permissions('organization:view'),
  getOrganization
);

router.patch(
  '/:id',
  auth,
  permissions('organization:update'),
  updateOrganization
);

router.delete(
  '/:id',
  auth,
  permissions('organization:delete'),
  deleteOrganization
);

export default router;