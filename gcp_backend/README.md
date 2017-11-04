# This directory contains the code supporting the back-end of the app Ed

## API call specification
The application is expected to generate a `POST` call towards the back-end following the specification outlined in the document _api_call_specification.json_. In particular, the following fields are mandatory

 - `output`: List of strings indicating the expected output services for the translation result. For the 1st version, we will only support `email` and `app`.
 - `email`: If the output list contains the `email` keyword, this field must contain the recipient's e-mail address.
 - `human_translation_requested`: Boolean to indicate whether the user wants a human translation.
 - `image`: Base64 representation of the picture taken by the user.
 - `timestamp`: Long representing the epoch time (ms) at which the request was generated on the phone.
 - `device`: String representing which phone model (`ios`, `android`) generated the request.
 - `version`: Float to indicate the version of the app.
 - `user_id`: UUID to uniquely identify a phone.

For the future, we foresee the following fields might be needed:

 - `input_language`: String indicating the input language. For the 1st version, this field will be ignored and we will assume `nl`.
 - `output_language`: String indicating the output language for the translation. For the 1st version, we will ignore this field and assume `en`.
 - `extract_reminder`: Boolean to indicate whether the user would like an automated extraction of the reminders attached to the mail he scanned. Ignored for the 1st version
