* [ ] Don't forget to create a credits page with author of the icons
- https://www.flaticon.com/free-icon/computer-screen_63337#term=computer&page=1&position=30
- https://www.flaticon.com/free-icon/user_149450#term=profile&page=1&position=18

## How to see console.log
https://stackoverflow.com/questions/30115372/how-to-do-logging-in-react-native
$ ./adb logcat | grep ReactNativeJS

## How to open debugger window
$ ./adb shell input keyevent 82

## How to enable hot reloading
$ ./adb reverse tcp:8081 tcp:8081

## How to start application on Android device
$ ./adb shell am start -n com.mailapprn/com.mailapprn.MainActivity