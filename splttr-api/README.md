# Splttr - API

Django REST Framework For Splttr API


## Installing

This project is best ran in a virtual environment. You can use [pyvenv][2],
which comes with python 3 and greater.

First install python3+ on your machine and then download and install [pip][1].
Then from the root of the project run:

1. `pyvenv venv` - Create a virtual environment in the venv folder
2. `source venv/bin/activate` - Load the environment
3. `pip install -r requirements.txt` - Install dependencies

To run the the server use the following commands:

1. `python manage.py migrate`
2. `python manage.py runserver`

You can provide a port after the `runserver`. However, the default is 8000. 

This project can also be ran using docker. Docker is a container system meant
to run an application with the same environment it was built in. This ensures
dependencies remain the same on every system. To get started, install the
docker toolbox with your favorite package manager. On mac, run  `brew cask
install dockertoolbox` to get the tools that you'll need. 

For every other system, vist [docker's website][3] for installation
istructions. 

To run this using docker, make sure that your docker machine is running if you
are on Mac/Windows. The command is `docker-machine start default` and `eval
$(docker-machine env default)` to configure your shell. Lastly, run the command
`docker compose up`. 


## Introduction

Splttr-api stores and manages the backend components to the [Splltr app][4]

### Dependencies

* Django
* django-rest-swagger
* djangorestframework
* Markdown
* PyYAML

These are installed when the `pip install` command is ran.

[1]: https://pip.pypa.io/en/latest/installing/
[2]: https://docs.python.org/3/using/scripts.html
[3]: https://docs.docker.com/engine/installation/
[4]: http://www.splttr.com
