import Organization from './organization.model.js';
import AppError from '../../shared/errors/AppError.js';

export const createOrganization = async (payload, userId) => {
    const exists = await Organization.findOne({
        code: payload.code.toUpperCase(),
    });

    if (exists) {
        throw new AppError('Organization code already exists', 409);
    }

    return Organization.create({
        ...payload,
        code: payload.code.toUpperCase(),
        createdBy: userId,
    });
};

export const getAllOrganizations = async (query = {}) => {
    return Organization.find(query)
        .populate('createdBy', 'firstName lastName email')
        .sort({ createdAt: -1 });
};

export const getOrganizationById = async (id) => {
    const organization = await Organization.findById(id);

    if (!organization) {
        throw new AppError('Organization not found', 404);
    }

    return organization;
};

export const updateOrganization = async (id, payload) => {
    const organization = await Organization.findByIdAndUpdate(
        id,
        payload,
        {
            new: true,
            runValidators: true,
        }
    );

    if (!organization) {
        throw new AppError('Organization not found', 404);
    }

    return organization;
};

export const deleteOrganization = async (id) => {
    const organization = await Organization.findById(id);

    if (!organization) {
        throw new AppError('Organization not found', 404);
    }

    await organization.deleteOne();

    return true;
};