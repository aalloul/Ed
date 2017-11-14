# OCR and translation endpoint

## API call specification
The application is expected to generate a `POST` call towards the back-end following the specification outlined in the document _api_call_specification.json_. In particular, the following fields are mandatory

 - `output`: List of strings indicating the expected output services for the translation result. For the 1st version, we will only support `email` and `app`.
 - `email`: If the output list contains the `email` keyword, this field must contain the recipient's e-mail address.
 - `human_translation_requested`: Boolean to indicate whether the user wants a human translation.
 - `image`: Base64 representation of the picture taken by the user.
 - `timestamp`: Long representing the epoch time (ms) at which the request was generated on the phone.
 - `device`: String representing which phone model (`ios`, `android`) generated the request.
 - `version`: Float to indicate the version of the app (0.1, alpha, ...etc).
 - `user_id`: UUID to uniquely identify a phone.

For the future, we foresee the following fields might be needed:

 - `input_language`: String indicating the input language. For the 1st version, this field will be ignored and we will assume `nl`.
 - `output_language`: String indicating the output language for the translation. For the 1st version, we will ignore this field and assume `en`.
 - `extract_reminder`: Boolean to indicate whether the user would like an automated extraction of the reminders attached to the mail he scanned. Ignored for the 1st version

Example call:
```bash
curl -XPOST https://linear-asset-184705.appspot.com/request_translation -H "Content-Type: text/json" --data-binary "@fixture/test_request.json"
```

This call should return (the request was for automated translation only)
```javascript
{
  "original_text": "Sommige vertalingstekst komt hier",
  "translated_text": "Some translation text goes here",
  "reminder": 1513071050000,
  "set_reminder": true,
}
```
where:

  - `original_text` is the text extracted from the picture
  - `translated_text`: is the translated text.
  - `set_reminder`: boolean to indicate whether a reminder is returned.
  - `reminder`: Epoch time in milliseconds to indicate when the reminder should be triggered

# Data reporting and tracking endpoint.
To enable us to track how our potential users interact with our app, it is important for us to:
  - define a data model that clearly indicates user behaviour
  - collect data following this data model and store it in a cloud data store
  - create dashboards to allow tracking the various KPIs

## Data model definition
The fields/columns expected to be reported on by the app are the following:
  - datamodel_version (double): Version of the data model, independent of both the client and back-end versions. It allows to track the updates to the data model.
  - app_version (double): Version of the app that is installed on the user's device.
  - phone_maker (string): Indicates the manufacturer of the phone.




```javascript
[
    {
        "datamodel_version": 0.1,
        "app_version": 0.2,
        "phone_maker": "Apple",
        "phone_model": "Iphone7",
        "os_version": "11.0.3",
        "user_id": "08fb1184-d74e-42f0-a4ae-ad65438a3dcc"
        "timestamp": 1510556219358,
        "type": "data",
        "screen": "scan_document",
        "action": "open_list_documents",
        "screen_start": 1510556217358,
        "screen_end": 1510556219358,
        "session_start": 1510556210358
    },
    {
        "datamodel_version": 0.1,
        "app_version": 0.2,
        "phone_maker": "LG",
        "phone_model": "G7",
        "os_version": "6",
        "user_id": "08fb1184-d74e-42f0-a4ae-ad65438a3dcc"
        "timestamp": 1510556219358,
        "type": "exception",
        "screen": "scan_document",
        "action": "open_list_documents",
        "exception_code": "NullPointerException",
        "stack_tracke": "...."
        "screen_start": 1510556217358,
        "screen_end": 1510556219358,
        "session_start": 1510556210358
    }
]
```