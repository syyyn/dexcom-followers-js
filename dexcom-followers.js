import axios from "axios"
import {DateTime} from "luxon"
import {validate as validateUuid} from 'uuid'
import {
    DEFAULT_UUID,
    DEXCOM_APPLICATION_ID,
    DEXCOM_AUTHENTICATE_ENDPOINT,
    DEXCOM_BASE_URL,
    DEXCOM_BASE_URL_OUS,
    DEXCOM_GLUCOSE_READINGS_ENDPOINT,
    DEXCOM_LOGIN_ID_ENDPOINT,
    DEXCOM_TREND_DIRECTIONS,
    MAX_MAX_COUNT,
    MAX_MINUTES,
    MMOL_L_CONVERSION_FACTOR,
    TREND_ARROWS,
    TREND_DESCRIPTIONS
} from "./const.js"
import {
    AccountError,
    AccountErrorEnum,
    ArgumentError,
    ArgumentErrorEnum,
    SessionError,
    SessionErrorEnum
} from "./errors.js"

const re = new RegExp("[^0-9]")

function valid_uuid(uuid) {
    return validateUuid(uuid)
}

class GlucoseReading {
    constructor(jsonGlucoseReading) {
        this._json = jsonGlucoseReading
        try {
            this._value = jsonGlucoseReading['Value']
            this._trend_direction = jsonGlucoseReading['Trend']
            this._trend = DEXCOM_TREND_DIRECTIONS[this._trend_direction]
            this._datetime = new DateTime(re.exec(jsonGlucoseReading['WT'])).toString()
        } catch (error) {
            throw new ArgumentError(ArgumentErrorEnum.GLUCOSE_READING_INVALID)
        }
    }

    get value() {
        return this._value
    }

    get mg_dl() {
        return this._value
    }

    get mmol_l() {
        return Math.round(this.value * MMOL_L_CONVERSION_FACTOR * 10) / 10
    }

    get trend() {
        return this._trend
    }

    get trend_direction() {
        return this._trend_direction
    }

    get trend_description() {
        return TREND_DESCRIPTIONS[this._trend]
    }

    get trend_arrow() {
        return TREND_ARROWS[this._trend]
    }

    get datetime() {
        return this._datetime
    }

    get json() {
        return this._json
    }

    toString() {
        return String(this._value)
    }
}

class DexcomFollowers {

    base_url = null
    session = null
    account_id = null
    application_id = DEXCOM_APPLICATION_ID
    session_id = null
    username = null
    password = null

    constructor(username = null, password = null, account_id = null, ous = false) {
        this.password = password
        this.username = username
        this.account_id = account_id
        this.session_id = null
        this.base_url = (ous) ? DEXCOM_BASE_URL_OUS : DEXCOM_BASE_URL
        this.session = axios.create()
    }

    async init() {
        await this._session()
    }

    validate_session_id() {
        if (![typeof this.session_id === 'string', this.session_id, valid_uuid(this.session_id)].every(Boolean)) {
            throw new ArgumentError(ArgumentErrorEnum.SESSION_ID_INVALID)
        }
        if (this.session_id === DEFAULT_UUID) {
            throw new ArgumentError(ArgumentErrorEnum.SESSION_ID_DEFAULT)
        }
    }

    validate_username() {
        if (![typeof this.username === 'string', this.username].every(Boolean)) {
            throw new ArgumentError(ArgumentErrorEnum.USERNAME_INVALID)
        }
    }

    validate_password() {
        if (![typeof this.password === 'string', this.password].every(Boolean)) {
            throw new ArgumentError(ArgumentErrorEnum.PASSWORD_INVALID)
        }
    }

    validate_account_id() {
        if (![typeof this.account_id === 'string', this.account_id, valid_uuid(this.account_id)].every(Boolean)) {
            throw new ArgumentError(ArgumentErrorEnum.ACCOUNT_ID_INVALID)
        }
        if (this.account_id === DEFAULT_UUID) {
            throw new ArgumentError(ArgumentErrorEnum.ACCOUNT_ID_DEFAULT)
        }
    }

    async post(endpoint, paramsData = null, jsonData = null) {
        let response
        if (paramsData) {
            response = await this.session.post(
                `${this.base_url}/${endpoint}`,
                paramsData
            )
        } else {
            response = await this.session.post(
                `${this.base_url}/${endpoint}`,
                jsonData,
                {headers: {'Accept-Encoding': 'application/json'}}
            )
        }
        try {
            return response.data
        } catch (error) {
            const dexcomError = this.handle_response(response)
            if (dexcomError) {
                throw dexcomError
            }
            throw error
        }
    }

    handle_response(response) {
        let error = null
        if (response.data) {
            const code = response.data.Code || null
            const message = response.data.Message || null

            if (code === "SessionIdNotFound") {
                error = new SessionError(SessionErrorEnum.NOT_FOUND)
            } else if (code === "SessionNotValid") {
                error = new SessionError(SessionErrorEnum.INVALID)
            } else if (code === "AccountPasswordInvalid") {
                error = new AccountError(AccountErrorEnum.FAILED_AUTHENTICATION)
            } else if (code === "SSO_AuthenticateMaxAttemptsExceeed") {
                error = new AccountError(AccountErrorEnum.MAX_ATTEMPTS)
            } else if (code === "SSO_InternalError") {
                if (message && message.includes("Cannot Authenticate by AccountName")) {
                    error = new AccountError(AccountErrorEnum.FAILED_AUTHENTICATION)
                } else if (message && message.includes("Cannot Authenticate by AccountId")) {
                    error = new AccountError(AccountErrorEnum.FAILED_AUTHENTICATION)
                }
            } else if (code === "InvalidArgument") {
                if (message && message.includes("accountName")) {
                    error = new ArgumentError(ArgumentErrorEnum.USERNAME_INVALID)
                } else if (message && message.includes("password")) {
                    error = new ArgumentError(ArgumentErrorEnum.PASSWORD_INVALID)
                } else if (message && message.includes("UUID")) {
                    error = new ArgumentError(ArgumentErrorEnum.ACCOUNT_ID_INVALID)
                }
            } else if (code && message) {
                //_LOGGER.debug("%s: %s", code, message)
            }
        }
        return error
    }

    async _session() {
        this.validate_password()
        if (this.account_id === null) {
            this.validate_username()
            this.account_id = await this.get_account_id()
        }
        this.validate_account_id()
        this.session_id = await this.get_session_id()
        this.validate_session_id()
    }

    async get_account_id() {
        return await this.post(DEXCOM_AUTHENTICATE_ENDPOINT, null, {
            accountName: this.username,
            password: this.password,
            applicationId: this.application_id,
        })
    }

    async get_session_id() {
        return await this.post(DEXCOM_LOGIN_ID_ENDPOINT, null, {
            accountId: this.account_id,
            password: this.password,
            applicationId: this.application_id,
        })
    }

    async _get_glucose_readings(minutes = MAX_MINUTES, max_count = MAX_MAX_COUNT) {
        if (typeof minutes !== 'number' || minutes < 0 || minutes > MAX_MINUTES) {
            throw new ArgumentError(ArgumentErrorEnum.MINUTES_INVALID)
        }
        if (typeof max_count !== 'number' || max_count < 0 || max_count > MAX_MAX_COUNT) {
            throw new ArgumentError(ArgumentErrorEnum.MAX_COUNT_INVALID)
        }
        return await this.post(DEXCOM_GLUCOSE_READINGS_ENDPOINT, {
            sessionId: this.session_id,
            minutes: minutes,
            maxCount: max_count,
        })
    }

    async get_glucose_readings(minutes = MAX_MINUTES, max_count = MAX_MAX_COUNT) {
        let jsonGlucoseReadings = []

        try {
            this.validate_session_id()
            jsonGlucoseReadings = await this._get_glucose_readings(minutes, max_count)

        } catch (error) {
            if (error instanceof SessionError) {
                await this._session()
                jsonGlucoseReadings = await this._get_glucose_readings(minutes, max_count)
            }
        }

        return jsonGlucoseReadings.map(jsonReading => new GlucoseReading(jsonReading))
    }

    async get_latest_glucose_reading() {
        const glucoseReadings = await this.get_glucose_readings(1)
        return glucoseReadings.length > 0 ? glucoseReadings[0] : null
    }

    async get_current_glucose_reading() {
        const glucoseReadings = await this.get_glucose_readings(10, 1)
        return glucoseReadings.length > 0 ? glucoseReadings[0] : null
    }
}