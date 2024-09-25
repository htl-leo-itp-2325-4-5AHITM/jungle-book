rm -rf target
mkdir -p target/nginx
cp ./docker/default.conf ./target/nginx/
mkdir -p ./target/frontend
cp -r ./frontend ./target/frontend/
docker build --tag frontend --file ./docker/Dockerfile ./target/
