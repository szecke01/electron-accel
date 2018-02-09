# Hardware Data Viz with Electron

This is a minimal electron app designed to query a micro-controller for data over the serial port, and visualize it. See: [http://sam.town/electron-hardware/](http://sam.town/electron-hardware) for a more complete write-up.

This code is comprised of two parts:

- `app` - Typical electron app, can be started with `npm install && npm start`
- `firmware` - Written for a Teensy microcontroller, will query an accelerometer for XYZ data

Run the application from within the `app` directory via:
```
$ npm install && npm start
```

## Resources for Learning Electron

- [electron.atom.io/docs](http://electron.atom.io/docs) - all of Electron's documentation
- [electron.atom.io/community/#boilerplates](http://electron.atom.io/community/#boilerplates) - sample starter apps created by the community
- [electron/electron-quick-start](https://github.com/electron/electron-quick-start) - a very basic starter Electron app
- [electron/simple-samples](https://github.com/electron/simple-samples) - small applications with ideas for taking them further
- [electron/electron-api-demos](https://github.com/electron/electron-api-demos) - an Electron app that teaches you how to use Electron
- [hokein/electron-sample-apps](https://github.com/hokein/electron-sample-apps) - small demo apps for the various Electron APIs

## License

[CC0 1.0 (Public Domain)](LICENSE.md)
