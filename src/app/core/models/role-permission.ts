import { KeyStatus } from "./common-models";

export interface Role {
    id: string;
    name: string;
    description: string;
    createdAt: Date,
    updatedAt: Date,
    status: 'active' | 'disabled';
}

export interface Permission {
    id: string;
    code: string;
    name: string;
    description: string;
    createdAt: Date,
    updatedAt: Date,
    status: KeyStatus;
}

export interface RolePermission {
    roleId: string;
    permissionId: string;
    createAt: Date;
}