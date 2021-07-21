#!/bin/bash
docker login -u neekit -p Nikit@123
docker pull neekit/countsystem || true
docker build --cache-from countsystem -t neekit/countsystem .
docker push neekit/countsystem
ssh -i countSystem.pem -o StrictHostKeyChecking=no ubuntu@18.116.48.227"docker login -u neekit -p Nikit@123; docker stop countsystemapi || true; docker rm countsystemapi || true; docker pull neekit/countsystem || true; docker run -d --name countsystemapi -p 4000:4000 --restart=always neekit/countsystem; docker system prune -f;"
