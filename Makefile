runios:
	react-native run-ios

runiosdevice:
	react-native run-ios --device --udid 32220edc259cb28f5a4fac2463df8fb10e9e4e9d

runandroid:
	react-native run-android

clean:
	watchman watch-del-all && rm -rf node_modules && yarn