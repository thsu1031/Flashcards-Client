export interface SessionToken {
    tokenId       : string,
    username      : string,
    valid         : boolean,
    expirationTime: Date,
    accessRights  : AccessRight[]
}

export enum AccessRight {
    CREATE,
    READ,
    UPDATE,
    DELETE
}