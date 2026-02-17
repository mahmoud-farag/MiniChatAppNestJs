

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
//* End User interfaces

