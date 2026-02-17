
import { Request as ExpressRequest } from 'express';
import { Prisma } from '@prisma/client';

//* Start User interfaces

export interface IUser {
   password: string;
    id: string;
    email: string;
    fullName: string;
    avatarS3FileName: string | null;
    avatarS3Folder: string | null;
    createdAt: Date;
    updatedAt: Date;
};

export interface IRequestWithUser extends ExpressRequest {
    user: Prisma.UserWhereUniqueInput;
};

//* End User interfaces

