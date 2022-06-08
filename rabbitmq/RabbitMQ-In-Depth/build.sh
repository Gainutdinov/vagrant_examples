docker-compose down && docker-compose up --build -d
docker-compose ps
#docker exec -ti notebook_InDepth bash
#  ipython notebook --port=8888 --no-browser --ip='*' --allow-root --NotebookApp.token='' --NotebookApp.password=''
docker exec notebook_InDepth bash  -c "ipython notebook --port=8888 --no-browser --ip='*' --allow-root --NotebookApp.token='' --NotebookApp.password=''"
