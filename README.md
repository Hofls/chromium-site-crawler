# chromium-site-crawler

### Installation
* Install JavaScript runtime environment - [NodeJS](https://nodejs.org/en/download/)
    * To check installation: commands `node -v` (should be version > 8) and `npm -v` (should be version > 5)
* In project root execute `npm install`
* Linux:
    * CentOS:
        * install dependencies for chromium: `yum install pango.x86_64 libXcomposite.x86_64 libXcursor.x86_64 libXdamage.x86_64 libXext.x86_64 libXi.x86_64 libXtst.x86_64 cups-libs.x86_64 libXScrnSaver.x86_64 libXrandr.x86_64 GConf2.x86_64 alsa-lib.x86_64 atk.x86_64 gtk3.x86_64 ipa-gothic-fonts xorg-x11-fonts-100dpi xorg-x11-fonts-75dpi xorg-x11-utils xorg-x11-fonts-cyrillic xorg-x11-fonts-Type1 xorg-x11-fonts-misc -y`
        * check that latest version of nss is installed - `yum update nss`
* Windows: runs without installing any additional dependencies

### Development
* To launch app with dev config (headful) `npm run launch_dev`
* To run tests `npm run test`
* To run specific test `npm run test-specific`
* Launch in debug mode: 
    * Run project `npm run debug_dev`
    * In google chrome open `chrome://inspect/#devices` and choose `Remote Target`
    * Add folder with source code in list `Sources`, set breakpoints
    * go to [link](http://localhost:8080/stick)

### Build and run
* To run app in production envicronment (headless) `npm run launch_prod`
* Optionally you can run with Docker (take a  look at `Dockerfile`)
