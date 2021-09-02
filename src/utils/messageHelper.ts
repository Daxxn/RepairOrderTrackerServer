export default interface MessageHelper {
  notImplemented: string;
  needToSetupAuth: string;
  noBody: string;
  userExists: string;
  noUserName: string;
  noUserFound: string;
  userDeleted: string;
  noId: string;
  adminOnlyForUsers: string;
  noAuthToken: string;
  badSession: string;
  tooManyModels: string;
  modelNotFound: <T>(model: T) => string;
  parentNotFound: <T>(model: T) => string;
}

export default class MessageHelper {
  private static _messageHelper: MessageHelper = {
    notImplemented: 'I will setup AUTH later. I Promise<Hopefully>.',
    noBody: 'Request body not found.',
    noUserFound: 'No user with that username found.',
    noId: 'No id was provided.',
    noUserName: 'Could not create user. userName must be provided.',
    userExists: 'This User already exists.',
    userDeleted: 'user sucessfully deleted.',
    needToSetupAuth: 'Auth is disabled. WIP.',
    adminOnlyForUsers: 'Only admins can access all users.',
    noAuthToken: 'No authorization token was found.',
    badSession:
      'Either the session expired or the userId was corrupted, session user id not found.',
    tooManyModels:
      'Too many models to save at one time. Split the models into multiple requests.',
    modelNotFound: <T>(model: T) => {
      return `Model not found in database: ${typeof model}`;
    },
    parentNotFound: <T>(model: T) => {
      return `Parent Model not found in database: ${typeof model}`;
    },
  };

  static get(): MessageHelper {
    return this._messageHelper;
  }
}
