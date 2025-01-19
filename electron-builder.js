// Path: codeSage.fe/electron-builder.js

module.exports = {
    appId: 'com.codesage.app',
    productName: 'CodeSage',
    copyright: 'Copyright © 2024 CodeSage',
    directories: {
      output: 'dist',
      buildResources: 'assets'
    },
    files: [
      'build/**/*',
      'electron/**/*',
      'package.json'
    ],
    win: {
      target: 'nsis',
      icon: 'assets/icon.ico'
    },
    mac: {
      target: 'dmg',
      icon: 'assets/icon.icns',
      category: 'public.app-category.developer-tools'
    },
    linux: {
      target: 'AppImage',
      icon: 'assets/icon.png',
      category: 'Development'
    },
    nsis: {
      oneClick: false,
      allowToChangeInstallationDirectory: true,
      createDesktopShortcut: true,
      createStartMenuShortcut: true,
      shortcutName: 'CodeSage'
    },
    publish: {
      provider: 'github',
      releaseType: 'release'
    }
  };