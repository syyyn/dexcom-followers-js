# dexcom-followers-js
A simple javascript API to interact with Dexcom Follow service. Used to get *real-time* Dexcom CGM sensor data.

# Quick-start
1. Download the [Dexcom G7 / G6 / G5 / G4](https://www.dexcom.com/apps) mobile app and [enable the Share service](https://provider.dexcom.com/education-research/cgm-education-use/videos/setting-dexcom-share-and-follow).

The Dexcom Share service requires setup of at least one follower to enable the share service, but `dexcom-followers-js` will use your (or the dependent's) credentials, not the follower's or manager's.

> [!CAUTION]
> With the release of the Dexcom G7, users are now able to sign up with a phone number or email address.
>
> `dexcom-followers-js` originally supported authentication with usernames only. However, in the recent days (July 22, 2024) some users have had success authenticating with their phone number and email address.
>
> While this is being investigated, try first authenticating with whatever user ID you signed up with (username, email address, phone number). If that doesn't work, authenticate using your account ID. You can find your account ID by logging in to [uam1.dexcom.com](https://uam1.dexcom.com) for US users or [uam2.dexcom.com](https://uam2.dexcom.com) for users outside of the US. After logging in, note the UUID in the URL -- this is your account ID.

2. Install the `dexcom-followers-js` package.

`npm i dexcom-followers-js`

3. Profit.

> [!IMPORTANT]
> See the caution above.
>
> Format phone numbers with a `+`, your country code, then your phone number, e.g. a US phone number of `(123)-456-7890` would be `"+11234567890"`.
>
> Format account IDs with hyphens, e.g. an account ID of `1234567890abcdef1234567890abcdef` found in the URL after logging in would be supplied as `12345678-90ab-cdef-1234-567890abcdef`.

```javascript
const dex = new DexcomFollowers("Username/Phone number", "Password")

dex.init().then(() => {
    dex.get_current_glucose_reading().then(glucoseReading => {
        glucoseReading._value
    })
})
```

# Frequently Asked Questions

## Why is my password not working?

The Dexcom Share API understandably reports limited information during account validation. If anything is incorrect, the API simply reports back invalid password ( `errors.AccountErrorEnum` ). However, there could be many reasons you are getting this error:

1. Use the correct Dexcom Share API instance.

If you are located outside of the United States, be sure to set `ous=True` when initializing `Dexcom` .

2. Use your Dexcom Share credentials, not the follower's credentials.

Use the same credentials used to login to the Dexcom mobile application publishing the glucose readings.

3. Ensure you have at least one follower on Dexcom Share.

The Dexcom Share service requires setup of at least one follower to enable the service, as does this package.

4. Check whether your account credentials involve usernames or emails.

There are two account types the Dexcom Share API uses: legacy username-based accounts, and newer email-based accounts. Be sure to use the correct authentication method.

5. Use alpha-numeric passwords.

Some individuals have had problems with connecting when their Dexcom Share passwords are entirely numeric. If you have connection issues, try changing your password to something with a mix of numbers and letters.

7. Report it!

The Dexcom Share API sometimes changes. If you believe there is an issue with `dexcom-followers-js` , feel free to [create an issue](https://github.com/syyyn/dexcom-followers-js/issues/new) if one has not been created yet already.

## Why not use the official Dexcom Developer API?

The official Dexcom API is a great tool to view trends, statistics, and day-by-day data, but is not suitable for real time fetching of glucose readings as it is a retrospective API.

## How can I let you know of suggestions or issues?

By all means submit a pull request if you have a feature you would like to see in the next release. Alternatively, you may [create an issue](https://github.com/syyyn/dexcom-followers-js/issues/new) if you have a suggestion or bug you'd like to report.

# Credit
Credit goes to [pydexcom](https://github.com/gagebenne/pydexcom). 
