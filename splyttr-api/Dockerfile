FROM python:3.5

ENV PYTHONUNBUFFERED 1
MAINTAINER David Rodriguez

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY requirements.txt /usr/src/app/
RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

COPY . /usr/src/app

RUN python manage.py migrate
RUN python manage.py collectstatic --noinput

EXPOSE 8050
ENTRYPOINT ["/bin/bash", "docker-entrypoint.sh"]
