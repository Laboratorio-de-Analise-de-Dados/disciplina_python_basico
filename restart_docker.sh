#!/bin/bash

docker restart $(docker ps -q)

docker logs $(docker ps -q)