# Kraken Bay

Open source Media Center and Netflix-like web server.
> Tested on Ubuntu 24.04

<p align="center">
  <img src="https://raw.githubusercontent.com/PetitPrinc3/Kraken-Bay/main/Images/GitHubDemo.gif" />
</p>

Includes :
- Main web server on port 80 (Netflix like interface)
    - Responsibe user interface
    - Complete in-browser admin interface (docker management etc.)
    - Automatic detection of new files and information retrival from The Movie Database®
    - ...
- File server to provide Assets on port 8080 (dockerized)
- MySQL server to handle main web server (dockerized)
- Two samba shares to provide a streaming service integrated in VLC
- "Hotspot mode" to turn you server in a hotspot
- ...

## Setup

###### :warning: This setup was made for and tested on Ubuntu 24.04. Note that it should work on debian based distros and mostly work on Windows (with some features disabled such as Samba, Hotspot mode, etc.)

Install pip requirements (as root) :

###### :warning: you should set this up in a venv to avoid breaking system packages.

> sudo pip install -r requirements.txt --break-system-packages

Run setup.py (as root) :

> sudo python setup.py

Open your browser and navigate to http://kraken.local/auth and login with the credentials defined in setup.py !  
To set up a demo, navigate to /admin and go to "Database Management" where you will find a card named "Setup Dummy Demo". Click on it and read the instructions.

> You have the possibility to edit the basic variables such as :
> - Username
> - Password
> - Hostname
> - Database
> - File path (where the Assets are stored (Movies, TV SHows etc.))
> - Port for the file server
>
> Keep in mind that the setup and features were tested with the default values and changing them may break some features.

## Features :


Fully functional and reactive web server with Netflix inspired UI, including :

| Desktop | Mobile | Desktop | Mobile |
| :-: | :-: | :-: | :-: |
| <img src="Images/Billboard.png" width="300" /> | <img src="Images/BillboardMobile.png" height="180" /> | <img src="Images/InfoModal.png" width="300" /> | <img src="Images/InfoModalMobile.png" height="180" /> |
| <img src="Images/Movies.png" width="300" /> | <img src="Images/MoviesMobile.png" height="180" /> | <img src="Images/Player.png" width="300" /> | <img src="Images/PlayerMobile.png" style="rotate('90deg')" height="180" /> |
| <img src="Images/Search.png" width="300" /> | <img src="Images/SearchMobile.png" height="180" /> | <img src="Images/Account.png" width="300" /> | <img src="Images/AccountMobile.png" height="180" /> |
| <img src="Images/Upload.png" width="300" /> | <img src="Images/UploadMobile.png" height="180" /> | <img src="Images/Tutorials.png" width="300" /> | <img src="Images/TutorialsMobile.png" height="180" /> |

A dedicated protected admin environment :

| Desktop | Mobile | Desktop | Mobile |
| :-: | :-: | :-: | :-: |
| <img src="Images/AdminDashboard.png" width="300" /> | <img src="Images/AdminDashboardMobile.png" height="180" /> | <img src="Images/AdminServer.png" width="300" /> | <img src="Images/AdminServerMobile.png" height="180" /> |
| <img src="Images/AdminDBManagement.png" width="300" /> | <img src="Images/AdminDBManagementMobile.png" height="180" /> |

And many more !!

## Known issues :

- Reduce user image upload size
- Close infomodal upon certain actions
- Fix link display on VLC tutorials
- Ensure full genre display in search

## Collaborate

Feel free to get in touch to share your ideas :
- Discord : PetitPrince#1380

## Support

> 👋🏼 Hey everyone ! I provide free software, feel free to use it and edit it as you wish. I will also provide a bit of support should you need it when contacted through the contact channels specified below. Feel free to help me out as you can !

- ⭐️ You can help by hitting Star on the repositories you like !
- ☕️ You can buy me a [coffee](https://www.paypal.com/paypalme/AReppelin)
- ✨ Contributions of any kind are welcome!

