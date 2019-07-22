#!/bin/bash

. config/settings.ini

# Create a log folder in the module folder if it don't already exists
if [ ! -d 'var' ]
then
  mkdir var
fi

if [ ! -d 'var/log' ]
then
  mkdir var/log
fi
