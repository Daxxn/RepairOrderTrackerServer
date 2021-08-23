export default interface MessageHelper {
  notImplemented: string;
  needToSetupAuth: string;
  noBody: string;
  userNameExists: string;
  noUserName: string;
  noUserFound: string;
  userDeleted: string;
  noId: string;
  adminOnlyForUsers: string;
  modelNotFound: <T>(model: T) => string;
};

export default class MessageHelper {
  private static _messageHelper:MessageHelper = {
    notImplemented: 'I will setup AUTH later. I Promise<Hopefully>.',
    noBody: 'Request body not found.',
    noUserFound: 'No user with that username found.',
    noId: 'No id was provided.',
    noUserName: 'Could not create user. userName must be provided.',
    userNameExists: 'This UserName already exists.',
    userDeleted: 'user sucessfully deleted.',
    needToSetupAuth: 'Auth is disabled. WIP.',
    adminOnlyForUsers: 'Only admins can access all users.',
    modelNotFound: <T>(model: T) => {
      return `Model not found in database: ${typeof model}`;
    },
  };

  static get(): MessageHelper {
    return this._messageHelper;
  }
}