export class InvalidRinkebyConfigurationError extends Error {
  public constructor() {
    super("Network needs to be set to 'rinkeby'");
    this.name = this.constructor.name;
  }
}

export class InvalidPrivateKeyError extends Error {
  public constructor() {
    super();
    this.name = this.constructor.name;
  }
}

export class InvalidParams extends Error {
  public constructor() {
    super();
    this.name = this.constructor.name;
  }
}

export class InvalidAddress extends Error {
  public constructor() {
    super();
    this.name = this.constructor.name;
  }
}

export class InvalidConnector extends Error {
  public constructor(message: string | void) {
    message ? super(message) : super();
    this.name = this.constructor.name;
  }
}

export class ActionFailed extends Error {
  public constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class InvalidArray extends Error {
  public constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class MissingField extends Error {
  public constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class InvalidFormat extends Error {
  public constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}
