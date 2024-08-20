class DexcomErrorEnum {
    constructor(value) {
        this.value = value
    }
}

class AccountErrorEnum extends DexcomErrorEnum {
    // `AccountError` strings.
    static FAILED_AUTHENTICATION = new AccountErrorEnum("Failed to authenticate")
    static MAX_ATTEMPTS = new AccountErrorEnum("Maximum authentication attempts exceeded")
}

class SessionErrorEnum extends DexcomErrorEnum {
    // `SessionError` strings.
    static NOT_FOUND = new SessionErrorEnum("Session ID not found")
    static INVALID = new SessionErrorEnum("Session not active or timed out")
}

class ArgumentErrorEnum extends DexcomErrorEnum {
    // `ArgumentError` strings.
    static MINUTES_INVALID = new ArgumentErrorEnum("Minutes must be and integer between 1 and 1440")
    static MAX_COUNT_INVALID = new ArgumentErrorEnum("Max count must be and integer between 1 and 288")
    static USERNAME_INVALID = new ArgumentErrorEnum("Username must be non-empty string")
    static TOO_MANY_USER_ID_PROVIDED = new ArgumentErrorEnum("Only one of account_id, username should be provided")
    static NONE_USER_ID_PROVIDED = new ArgumentErrorEnum("At least one of account_id, username should be provided")
    static PASSWORD_INVALID = new ArgumentErrorEnum("Password must be non-empty string")
    static ACCOUNT_ID_INVALID = new ArgumentErrorEnum("Account ID must be UUID")
    static ACCOUNT_ID_DEFAULT = new ArgumentErrorEnum("Account ID default")
    static SESSION_ID_INVALID = new ArgumentErrorEnum("Session ID must be UUID")
    static SESSION_ID_DEFAULT = new ArgumentErrorEnum("Session ID default")
    static GLUCOSE_READING_INVALID = new ArgumentErrorEnum("JSON glucose reading incorrectly formatted")
}

class DexcomError extends Error {
    // Base class for all `pydexcom` errors.
    constructor(enum_) {
        // Create `DexcomError` from `DexcomErrorEnum`.
        // :param enum_: associated `DexcomErrorEnum`
        super(enum_.value)
        this._enum = enum_
    }

    get enum() {
        // Get `DexcomErrorEnum` associated with error.
        // :return: `DexcomErrorEnum`
        return this._enum
    }
}

class AccountError extends DexcomError {
    // Errors involving Dexcom Share API credentials.
}

class SessionError extends DexcomError {
    // Errors involving Dexcom Share API session.
}

class ArgumentError extends DexcomError {
    // Errors involving `pydexcom` arguments.
}

export {
    DexcomErrorEnum,
    AccountErrorEnum,
    SessionErrorEnum,
    ArgumentErrorEnum,
    DexcomError,
    AccountError,
    SessionError,
    ArgumentError
}