# Data reporting and tracking endpoint.
To enable us to track how our potential users interact with our app, it is important for us to:
  - define a data model that clearly indicates user behaviour
  - collect data following this data model and store it in a cloud data store
  - create dashboards to allow tracking the various KPIs

## Data model definition
The fields/columns expected to be reported on by the app are the following:
  - `datamodel_version` (double): Version of the data model, independent of both the client and back-end versions. It allows to track the updates to the data model.
  - `app_version` (double): Version of the app that is installed on the user's device.
  - `phone_maker` (string): Indicates the manufacturer of the phone.
  - `phone_model` (string): Indicates the model of the phone (Iphone7, S8, ...etc)
  - `os_version` (string): Indicates the version of the OS
  - `user_id` (string): UUID4 to uniquely identify a phone
  - `timestamp` (long int): Epoch time in milliseconds at which the event was generated
  - `type` (string): Identifies which data type this model pertains to. For now, the expected values are:
    - `data`: to identify an event reporting on user behaviour
    - `exception`: to identify an exception
    - `back-end`: to identify metrics from the back-end
  - `screen` (string): Name of the screen on which this data was generated. For example:
    - `welcome_screen`
    - `scan_screen`
    - ...
  - `action` (string): Identifies the action that generated the event. Examples are:
    - `app_start`: generated when the app started
    - `create_scan`: generated when the user takes the picture
    - `app_end`: generated when the user leaves the app
    - `request_human_translation`
    - ...
  - `screen_start` (long int): Time (epoch milliseconds) when the current screen was open
  - `screen_end` (long int): Time (epoch milliseconds) when the current screen ended (if the action leads to a change of screen)
  -  `session_start` (long_int): Time (epoch milliseconds) when the current session started.

When an exception was caught during the app lifecycle, the `type` field takes the value `exception` and the following fields are expected:

  - `exception_code` (string): String identifying the exception. For example `NullPointerException`
  - `stack_trace` (string): String that displays the full stack trace of the exception.

When the user leaves the app, the `action` field takes the value `app_end` and the following extra fields are expected:

  - `number_scans` (int): Number of scans made during the session
  - `session duration` (int): Duration (in milliseconds) of the entire session

The below JSON shows three events (not necessarily generated and sent together) that follow the above described data model.

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
        "stack_trace": "...."
        "screen_start": 1510556217358,
        "screen_end": 1510556219358,
        "session_start": 1510556210358
    },
    {
        "datamodel_version": 0.1,
        "app_version": 0.2,
        "phone_maker": "Apple",
        "phone_model": "Iphone7",
        "os_version": "11.0.3",
        "user_id": "08fb1184-d74e-42f0-a4ae-ad65438a3dcc"
        "timestamp": 1510556219358,
        "type": "data",
        "screen": "send_document",
        "action": "app_end",
        "screen_start": 1510556217358,
        "screen_end": 1510556219358,
        "session_start": 1510556210358,
        "session_end": 1510556230358,
        "session_duration": 20000,
        "number_scans": 1
    }
]
```

## How to post data to the endpoint
A simple POST as follows will get the data into BigQuery

``` curl -XPOST https://reporting-dot-linear-asset-184705.appspot.com/events -H "Content-Type: application/json" --data-binary "@fixture/test_request.json"```

It is also possible to replace `--data-binary "@fixture/test_request.json"` by a list of 1 or more JSON documents.