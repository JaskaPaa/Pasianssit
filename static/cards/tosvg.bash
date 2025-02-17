#! /bin/bash

for file in *.svg; do
    inkscape "$file" --export-type=png --export-filename="${file%.svg}.png"
    #echo "${file%.svg}.png"
done
