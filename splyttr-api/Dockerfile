FROM python:3.5

ENV PYTHONUNBUFFERED 1
MAINTAINER David Rodriguez

ENV USER splttr

RUN useradd -s /bin/bash $USER

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY requirements.txt /usr/src/app/
RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

COPY . /usr/src/app

RUN python manage.py migrate

RUN chown -R $USER .

USER $USER

EXPOSE 8050
ENTRYPOINT ["python", "manage.py", "runserver", "0.0.0.0:8050"]
