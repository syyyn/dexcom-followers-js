const DEXCOM_APPLICATION_ID = "d89443d2-327c-4a6f-89e5-496bbb0317db"
/**
 * Dexcom application ID.
 */

const DEXCOM_BASE_URL = "https://share2.dexcom.com/ShareWebServices/Services"
/**
 * Dexcom Share API base url for US.
 */

const DEXCOM_BASE_URL_OUS = "https://shareous1.dexcom.com/ShareWebServices/Services"
/**
 * Dexcom Share API base url for outside of the US.
 */

const DEXCOM_LOGIN_ID_ENDPOINT = "General/LoginPublisherAccountById"
/**
 * Dexcom Share API endpoint used to retrieve account ID.
 */

const DEXCOM_AUTHENTICATE_ENDPOINT = "General/AuthenticatePublisherAccount"
/**
 * Dexcom Share API endpoint used to retrieve session ID.
 */

const DEXCOM_GLUCOSE_READINGS_ENDPOINT = "Publisher/ReadPublisherLatestGlucoseValues"
/**
 * Dexcom Share API endpoint used to retrieve glucose values.
 */

const DEFAULT_UUID = "00000000-0000-0000-0000-000000000000"
/**
 * UUID consisting of all zeros, likely error if returned by Dexcom Share API.
 */

const DEXCOM_TREND_DIRECTIONS = {
    "None": 0,  // unconfirmed
    "DoubleUp": 1,
    "SingleUp": 2,
    "FortyFiveUp": 3,
    "Flat": 4,
    "FortyFiveDown": 5,
    "SingleDown": 6,
    "DoubleDown": 7,
    "NotComputable": 8,  // unconfirmed
    "RateOutOfRange": 9,  // unconfirmed
}
/**
 * Trend directions returned by the Dexcom Share API mapped to `int`.
 */

const TREND_DESCRIPTIONS = [
    "",
    "rising quickly",
    "rising",
    "rising slightly",
    "steady",
    "falling slightly",
    "falling",
    "falling quickly",
    "unable to determine trend",
    "trend unavailable",
]
/**
 * Trend descriptions ordered identically to `DEXCOM_TREND_DIRECTIONS`.
 */

const TREND_ARROWS = ["", "↑↑", "↑", "↗", "→", "↘", "↓", "↓↓", "?", "-"]
/**
 * Trend arrows ordered identically to `DEXCOM_TREND_DIRECTIONS`.
 */

const MAX_MINUTES = 1440
/**
 * Maximum minutes to use when retrieving glucose values (1 day).
 */

const MAX_MAX_COUNT = 288
/**
 * Maximum count to use when retrieving glucose values (1 reading per 5 minutes).
 */

const MMOL_L_CONVERSION_FACTOR = 0.0555
/**
 * Conversion factor between mg/dL and mmol/L.
 */

export {
    DEXCOM_APPLICATION_ID,
    DEXCOM_BASE_URL,
    DEXCOM_BASE_URL_OUS,
    DEXCOM_LOGIN_ID_ENDPOINT,
    DEXCOM_AUTHENTICATE_ENDPOINT,
    DEXCOM_GLUCOSE_READINGS_ENDPOINT,
    DEXCOM_TREND_DIRECTIONS,
    TREND_DESCRIPTIONS,
    TREND_ARROWS,
    MAX_MINUTES,
    MAX_MAX_COUNT,
    MMOL_L_CONVERSION_FACTOR,
    DEFAULT_UUID
}